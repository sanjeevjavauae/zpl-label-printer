package routisync.lebelprinter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
/*when frontend requests /images/filename.jpg, Spring will serve the file from uploaded-images/filename.jpg*/
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**") // URL path
                .addResourceLocations("file:uploaded-images/"); // folder on disk
    }
}