package com.example.board.util;

import com.example.board.entity.User;
import com.example.board.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // .findByUsername이 Optional<User>를 반환한다고 가정할 때
        User userEntity = userRepository.findByUsername(username)
                                        .orElse(null); // 없으면 null 반환
        
        if (userEntity != null) {
            return new PrincipalDetails(userEntity);
        }
        return null;
    }
}