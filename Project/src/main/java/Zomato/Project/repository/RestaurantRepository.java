package Zomato.Project.repository;


import Zomato.Project.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByRestaurantPhoneNumber(String restaurantPhoneNumber);


    Restaurant findByIdAndMenuItemListId(Long restaurantId, Long menuItemId);

    Restaurant findByIdAndMenuItemListIdAndMenuItemList_MenuItemVariantListId(Long restaurantId, Long menuItemId, Long menuItemVariantId);

    @Query(value = "select r.* from restaurant r inner join address a on r.address_id = a.id where ST_Distance_Sphere(POINT(a.longitude, a.latitude), POINT(:userLon,:userLat)) < 5000;",nativeQuery = true)
    List<Restaurant> findNearByRestaurant(Double userLon, Double userLat);
}
