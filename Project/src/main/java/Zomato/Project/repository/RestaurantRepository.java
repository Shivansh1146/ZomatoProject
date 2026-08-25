package Zomato.Project.repository;


import Zomato.Project.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByRestaurantPhoneNumber(String restaurantPhoneNumber);


    Restaurant findByIdAndMenuItemListId(Long restaurantId, Long menuItemId);

    Restaurant findByIdAndMenuItemListIdAndMenuItemList_MenuItemVariantListId(Long restaurantId, Long menuItemId, Long menuItemVariantId);
}
