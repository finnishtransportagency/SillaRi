package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.RouteTransportNumberModel;
import fi.vaylavirasto.sillari.repositories.RouteTransportNumberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RouteTransportNumberService {
    private RouteTransportNumberRepository routeTransportNumberRepository;

    @Autowired
    public RouteTransportNumberService(RouteTransportNumberRepository routeTransportNumberRepository) {
        this.routeTransportNumberRepository = routeTransportNumberRepository;
    }

    public Map<Long, List<RouteTransportNumberModel>> getRouteTransportNumbersForRoutes(List<RouteModel> routes, String permitNumber) {
        // Get all transport numbers for route, including possible other permit versions with the same route lelu id
        List<Long> routeLeluIds = routes.stream().map(RouteModel::getLeluId).collect(Collectors.toList());
        return routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluIds(routeLeluIds, permitNumber);
    }

    public Integer getNextAvailableTransportNumber(RouteModel route, String permitNumber) {
        // Get all transport numbers for route, including possible other permit versions with the same route lelu id
        Map<Integer, List<RouteTransportNumberModel>> allTransportNumbersPerRoute = routeTransportNumberRepository.getRouteTransportNumbersByRouteLeluId(route.getLeluId(), permitNumber);
        Integer currentRouteId = route.getId();

        if (allTransportNumbersPerRoute != null && !allTransportNumbersPerRoute.isEmpty()) {
            if (allTransportNumbersPerRoute.keySet().size() > 1) {
                // Multiple routes with same lelu id and permit number - must take other permit versions into account when determining the transport number

                // Get the total transport count for this permit version of the route
                Integer totalTransportCount = allTransportNumbersPerRoute.get(currentRouteId).get(0).getRouteTotalTransportCount();

                // List all used transport numbers for all different versions of the route
                // Add all transport numbers to list and filter used transport numbers
                List<Integer> allUsedTransportNumbers = allTransportNumbersPerRoute.values().stream().flatMap(Collection::stream)
                        .filter((RouteTransportNumberModel::isUsed)).map(RouteTransportNumberModel::getTransportNumber).collect(Collectors.toList());

                log.debug("Used transport numbers for route {} with leluId {} and permit number {}: {}", route.getId(), route.getLeluId(), permitNumber, allUsedTransportNumbers);
                int totalUsedTransportNumberCount = allUsedTransportNumbers.size();

                if (totalTransportCount > totalUsedTransportNumberCount) {
                    // We still have some transport numbers available
                    // Select unused transport numbers for current route, ignore transport numbers which have been used in some other permit version
                    List<Integer> availableTransportNumbers = allTransportNumbersPerRoute.get(currentRouteId).stream()
                            .filter(routeTransportNumber -> !routeTransportNumber.isUsed() && !allUsedTransportNumbers.contains(routeTransportNumber.getTransportNumber()))
                            .map(RouteTransportNumberModel::getTransportNumber).collect(Collectors.toList());
                    log.debug("Available transport numbers for route {} with leluId {} and permit number {}: {}", route.getId(), route.getLeluId(), permitNumber, availableTransportNumbers);

                    // Select the smallest available transport number for this route
                    return !availableTransportNumbers.isEmpty() ? availableTransportNumbers.stream().min(Integer::compare).get() : null;
                } else {
                    log.debug("All transport numbers used for route {} with leluId {} and permit number {}", route.getId(), route.getLeluId(), permitNumber);
                    return null;
                }
            } else {
                // Only one permit version exists for this route
                // Filter used transport numbers and select the smallest available transport number, if such exists
                Optional<RouteTransportNumberModel> nextAvailableRouteTransportNumber = allTransportNumbersPerRoute.get(currentRouteId).stream()
                        .filter(routeTransportNumber -> !routeTransportNumber.isUsed())
                        .min(Comparator.comparing(RouteTransportNumberModel::getTransportNumber));
                return nextAvailableRouteTransportNumber.map(RouteTransportNumberModel::getTransportNumber).orElse(null);
            }
        } else {
            return null;
        }
    }
    public void setTransportNumberUsed(RouteTransportModel routeTransport) {
        routeTransportNumberRepository.updateRouteTransportNumber(routeTransport.getRouteId(), routeTransport.getId(), routeTransport.getTransportNumber(), true);
    }

    public void setTransportNumberAvailable(RouteTransportModel routeTransport) {
        routeTransportNumberRepository.updateRouteTransportNumber(routeTransport.getRouteId(), null, routeTransport.getTransportNumber(), false);
    }

}
