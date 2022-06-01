package fi.vaylavirasto.sillari.service.trex.bridgePicInterface;

import java.util.List;

import lombok.Data;

public @Data
class TrexPicInfoResponseJson {
    private List<KuvatiedotItem> kuvatiedot;
}