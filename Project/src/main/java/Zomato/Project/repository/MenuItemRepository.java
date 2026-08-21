package Zomato.Project.repository;

import Zomato.Project.entity.MenuItem;
import Zomato.Project.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    MenuItem findByRestaurantAndMenuItemName(Restaurant restaurant, String menuItemName);
}
