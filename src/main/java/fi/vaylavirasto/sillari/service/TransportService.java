package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.AddressModel;
import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.model.tables.pojos.Address;
import fi.vaylavirasto.sillari.model.tables.pojos.Transport;
import fi.vaylavirasto.sillari.repositories.AddressRepository;
import fi.vaylavirasto.sillari.repositories.TransportRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TransportService {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private TransportRepository transportRepository;
    @Autowired
    private AddressRepository addressRepository;

    public List<TransportModel> getTransports(Integer limit) {
        logger.debug(String.format("getTransports(%s)", limit));

        /*
        ArrayList<TransportModel> retval = new ArrayList<>();
        List<Transport> list = transportRepository.getAllTransports();
        for(Transport transport : list) {
            TransportModel model = new TransportModel();
            model.setId(transport.getId());
            model.setTitle(transport.getTitle());
            model.setDepartureAddress(new AddressModel());
            model.setArrivalAddress(new AddressModel());
            Address arrivalAddress = addressRepository.getAddressById(transport.getArrivalAddressId());
            Address departureAddress = addressRepository.getAddressById(transport.getDepartureAddressId());
            model.setArrivalAddress(getAddressModel(arrivalAddress));
            model.setDepartureAddress(getAddressModel(departureAddress));
            retval.add(model);
        }
        return retval;
        */

        if (limit >= 0) {
            return transportRepository.getAllTransports(limit);
        } else {
            return new ArrayList<>();
        }
    }

    public TransportModel getTransport(int id) {
        logger.debug(String.format("getTransport(%s)", id));

        Transport transport = transportRepository.getTransportById(id);
        TransportModel model = new TransportModel();
        model.setId(transport.getId());
        model.setTitle(transport.getTitle());
        model.setDepartureAddress(new AddressModel());
        model.setArrivalAddress(new AddressModel());
        Address arrivalAddress = addressRepository.getAddressById(transport.getArrivalAddressId());
        Address departureAddress = addressRepository.getAddressById(transport.getDepartureAddressId());
        model.setArrivalAddress(getAddressModel(arrivalAddress));
        model.setDepartureAddress(getAddressModel(departureAddress));
        return model;
    }
    private AddressModel getAddressModel(Address address) {
        AddressModel addressModel = new AddressModel();
        addressModel.setId(address.getId());
        addressModel.setStreet(address.getStreet());
        addressModel.setPostalcode(address.getPostalcode());
        addressModel.setCity(address.getCity());
        return addressModel;
    }
}
