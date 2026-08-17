package Zomato.Project.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "address")
@SoftDelete
public class Address extends Base {

    private String streetLine1;
    private String streetLine2;
    private String pinCode;
    private String state;
    private String country;

    private Double latitude;
    private Double longitude;

    private String addressType;
    private Boolean defaultAddress;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
