package Zomato.Project.entity;

import Zomato.Project.enums.DishType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;


import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "dish")
@SoftDelete
public class Dish extends Base {

    @Column(name = "name", nullable = false)
    private String dishName;

    @Column(name = "description", nullable = false)
    private String dishDescription;

    @Column(name = "type", nullable = false)
    private DishType dishType;

    @Column(name = "rating", nullable = false)
    private Double dishRating;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL)
//    @JoinColumn(name = "variant_list", nullable = false)
    private List<DishVariant> dishVariantList;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
