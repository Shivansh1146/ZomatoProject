package Zomato.Project.repository;

import Zomato.Project.entity.MenuItem;
import Zomato.Project.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    Optional<MenuItem> findByRestaurantAndMenuItemName(Restaurant restaurant, String menuItemName);


}
