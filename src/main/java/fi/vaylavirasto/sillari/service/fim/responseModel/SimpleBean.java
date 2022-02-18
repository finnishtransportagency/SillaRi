package fi.vaylavirasto.sillari.service.fim.responseModel;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString
public class SimpleBean {

    private int x = 1;
    private int y = 2;
    private String abc;
    @JacksonXmlElementWrapper(useWrapping = false)
    private List<BeanToo> beanToo= new ArrayList<>();;




}
