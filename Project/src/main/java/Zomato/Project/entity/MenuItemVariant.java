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
@Entity(name = "menu_variant")
@SoftDelete
public class MenuItemVariant extends Base {

    @Column(name = "name", nullable = false)
    private String menuVariantName;

    @Column(name = "price", nullable = false)
    private Double menuVariantPrice;

    @Column(name = "available", nullable = false)
    private Boolean menuVariantAvailable;

    @Column(nullable = false)
    private Boolean inventoryManaged;

    @Column(nullable = false)
    private Long currentAvailableInventoryCount;

    @ManyToOne
    @JoinColumn(name = "menu_item_id")
    private MenuItem menuItem;

}
