package Zomato.Project.service;

import Zomato.Project.dto.AddressRequestDTO;
import Zomato.Project.entity.Address;
import Zomato.Project.entity.User;
import Zomato.Project.repository.AddressRepository;
import Zomato.Project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AddressService {
    @Autowired
    private AddressRepository addressRepository;
    @Autowired
    private UserRepository userRepository;

    public String addAddressInUser(Long userId, AddressRequestDTO addressRequestDTO) {

        Optional<User> checkingUserId = userRepository.findById(userId);
        if (checkingUserId.isEmpty()) {
            return "user id does not exist";
        }
        User user = checkingUserId.get();

        Address address = new Address();
        address.setStreetLine1(addressRequestDTO.getStreetLine1());
        address.setStreetLine2(addressRequestDTO.getStreetLine2());
        address.setPinCode(addressRequestDTO.getPinCode());
        address.setState(addressRequestDTO.getState());
        address.setCountry(addressRequestDTO.getCountry());
        address.setLatitude(addressRequestDTO.getLatitude());
        address.setLongitude(addressRequestDTO.getLongitude());
        address.setAddressType(addressRequestDTO.getAddressType());
        address.setDefaultAddress(addressRequestDTO.getDefaultAddress());

        address.setUser(user);

        addressRepository.saveAndFlush(address);
        return "Successfully your address is added ";


    }
}
