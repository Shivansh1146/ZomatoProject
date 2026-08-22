package Zomato.Project.entity;

import Zomato.Project.enums.MenuItemType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SoftDelete;


import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "menu_item")
@SoftDelete
public class MenuItem extends Base {

    @Column(name = "name", nullable = false)
    private String menuItemName;

    @Column(name = "description", nullable = false)
    private String menuItemDescription;

    @Column(name = "type", nullable = false)
    @Enumerated(value = EnumType.STRING)
    private MenuItemType menuItemType;

    @Column(name = "rating")
    private Double menuItemRating;

    @Column(name = "label", nullable = false)
    private String menuItemLabel;

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL)
//    @JoinColumn(name = "variant_list", nullable = false)
    private List<MenuItemVariant> menuItemVariantList;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;
}
