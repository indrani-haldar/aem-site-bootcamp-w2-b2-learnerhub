package com.learnerhub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class)
public class ResourceCardModel {

    private static final String DEFAULT_TYPE = "Guide";

    @ValueMapValue
    @Optional
    private String title;

    @ValueMapValue
    @Optional
    private String resourceType;

    @ValueMapValue
    @Optional
    private String description;

    @ValueMapValue
    @Optional
    private String readingTime;

    @ValueMapValue
    @Optional
    private String link;

    public String getTitle() {
        return title;
    }

    public String getResourceType() {
        return resourceType != null && !resourceType.isEmpty() ? resourceType : DEFAULT_TYPE;
    }

    public String getDescription() {
        return description;
    }

    public String getReadingTime() {
        return readingTime;
    }

    public String getLink() {
        return link;
    }

    public boolean isEmpty() {
        return title == null || title.isEmpty();
    }
}