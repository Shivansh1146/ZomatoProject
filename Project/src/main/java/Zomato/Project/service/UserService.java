package Zomato.Project.service;

import Zomato.Project.dto.UserRequestDTO;
import Zomato.Project.entity.User;
import Zomato.Project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String addUser(UserRequestDTO userRequestDTO) {
        Optional<User> existingUserEmail = userRepository.findByUserEmail(userRequestDTO.getUserEmail());
        if (existingUserEmail.isPresent()) {
            return "user email  is already exist ";
        }

        Optional<User> existingPhoneNumber = userRepository.findByUserPhoneNumber(userRequestDTO.getUserPhoneNumber());
        if (existingPhoneNumber.isPresent()) {
            return "user phone number is already exist";
        }
        User user = convertDTOToEntity(userRequestDTO);
        userRepository.save(user);
        return "Successful user is added";
    }

    private User convertDTOToEntity(UserRequestDTO userRequestDTO) {
        User user = new User();
        user.setUserName(userRequestDTO.getUserName());
        user.setUserEmail(userRequestDTO.getUserEmail());
        user.setUserPhoneNumber(userRequestDTO.getUserPhoneNumber());
        return user;
    }

    public String deleteUser(Long userId) {
        Optional<User> checkUser = userRepository.findById(userId);
        if (checkUser.isEmpty()){
            return "user does not exist";
        }
        userRepository.deleteById(userId);
        return "Successful user is deleted";
    }
}
