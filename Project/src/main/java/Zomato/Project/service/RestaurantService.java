package Zomato.Project.service;

import Zomato.Project.dto.RestaurantRequestDTO;
import Zomato.Project.entity.Address;
import Zomato.Project.entity.Restaurant;
import Zomato.Project.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RestaurantService {
    @Autowired
    private RestaurantRepository restaurantRepository;

    public String addRestaurant(RestaurantRequestDTO restaurantRequestDTO) {

        Optional<Restaurant> existing = restaurantRepository.findByRestaurantPhoneNumber(restaurantRequestDTO.getRestaurantPhoneNumber());
        if (existing.isPresent()) {
            return "Restaurant Phone number is already exist";
        }
        Restaurant restaurant = convertRestaurantDTOToEntity(restaurantRequestDTO);
        restaurantRepository.save(restaurant);
    }

    private Restaurant convertRestaurantDTOToEntity(RestaurantRequestDTO restaurantRequestDTO) {
        Restaurant restaurant = new Restaurant();

        restaurant.setRestaurantName(restaurantRequestDTO.getRestaurantName());
        restaurant.setRestaurantPhoneNumber(restaurantRequestDTO.getRestaurantPhoneNumber());

        Address address = new Address();

        address.setStreetLine1(restaurantRequestDTO.getStreetLine1());
        address.setStreetLine2(restaurantRequestDTO.getStreetLine2());
        address.setPinCode(restaurantRequestDTO.getPinCode());
        address.setState(restaurantRequestDTO.getState());
        address.setCountry(restaurantRequestDTO.getCountry());
        address.setLatitude(restaurantRequestDTO.getLatitude());
        address.setLongitude(restaurantRequestDTO.getLongitude());

        restaurant.setRestaurantAddress(address);
        return restaurant;
    }
}
