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
@Entity(name = "dish_variant")
@SoftDelete
public class DishVariant extends Base {

    @Column(name = "name", nullable = false)
    private String dishVariantName;

    @Column(name = "price", nullable = false)
    private Double dishVariantPrice;

    @Column(name = "available", nullable = false)
    private Boolean dishVariantAvailable;

    @ManyToOne
    @JoinColumn(name = "dish_id")
    private Dish dish;

}
