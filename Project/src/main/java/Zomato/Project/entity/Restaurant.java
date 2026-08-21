package Zomato.Project.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "restaurant")
@SoftDelete
public class Restaurant extends Base {

    @Column(name = "name", nullable = false)
    private String restaurantName;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String restaurantPhoneNumber;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id",nullable = false)
    private Address restaurantAddress;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<MenuItem> menuItemList;
}
