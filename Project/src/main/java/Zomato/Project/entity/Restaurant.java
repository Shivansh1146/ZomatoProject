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

    private String restaurantName;
    private String restaurantPhoneNumber;

    @OneToOne
    @JoinColumn(name = "address_id")
    private Address restaurantAddress;

    @OneToMany(mappedBy = "restaurant",cascade = CascadeType.ALL)
    private List<Dish> dishList;
}
