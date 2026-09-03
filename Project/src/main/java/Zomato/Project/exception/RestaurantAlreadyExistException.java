package Zomato.Project.exception;

public class RestaurantAlreadyExistException extends RuntimeException {
    public RestaurantAlreadyExistException(String msg){
        super(msg);
    }
}
