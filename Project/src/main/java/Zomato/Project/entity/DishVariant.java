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
@Entity(name = "dishVariant")
@SoftDelete
public class DishVariant extends Base {

    private String dishVariantName;
    private Double dishVariantPrice;
    private Boolean dishVariantAvailable;

    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dish dish;
}
