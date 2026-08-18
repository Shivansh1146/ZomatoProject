package Zomato.Project.entity;

import jakarta.persistence.Column;
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

    @Column(nullable = false)
    private String streetLine1;

    private String streetLine2;

    @Column(nullable = false)
    private String pinCode;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "type", nullable = false)
    private String addressType;

    @Column(nullable = false)
    private Boolean defaultAddress;

    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;
}
