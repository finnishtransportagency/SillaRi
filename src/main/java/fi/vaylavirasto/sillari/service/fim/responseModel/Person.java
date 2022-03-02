package fi.vaylavirasto.sillari.service.fim.responseModel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * <p>Java class for personType complex type.
 *
 * <p>The following schema fragment specifies the expected content contained within this class.
 *
 * <pre>
 * &lt;complexType name="personType">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ObjectKey" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="ObjectID" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="AccountName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="DisplayName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="FirstName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="LastName" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Email" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Yksikko" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *         &lt;element name="Department" type="{http://www.w3.org/2001/XMLSchema}string"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 */

@ToString
@Getter
@Setter
public class Person {
    @JsonProperty("ObjectKey")
    protected String objectKey;
    @JsonProperty("ObjectID")
    protected String objectID;
    @JsonProperty("AccountName")
    protected String accountName;
    @JsonProperty("DisplayName")
    protected String displayName;
    @JsonProperty("FirstName")
    protected String firstName;
    @JsonProperty("LastName")
    protected String lastName;
    @JsonProperty("Email")
    protected String email;
    @JsonProperty("Yksikko")
    protected String yksikko;
    @JsonProperty("Department")
    protected String department;
}
