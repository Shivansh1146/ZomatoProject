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
    private String dishName;
    private String dishDescription;
    private DishType dishType;
    private Double dishRating;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL)
    private List<DishVariant> dishVariantList;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
