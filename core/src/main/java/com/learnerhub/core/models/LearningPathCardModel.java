package com.learnerhub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class)
public class LearningPathCardModel {

    @ValueMapValue
    @Optional
    private String title;

    @ValueMapValue
    @Optional
    private String fileReference;

    @ValueMapValue
    @Optional
    private String alt;

    @ValueMapValue
    @Optional
    private String courseCount;

    @ValueMapValue
    @Optional
    private String duration;

    @ValueMapValue
    @Optional
    private String link;

    public String getTitle() {
        return title;
    }

    public String getFileReference() {
        return fileReference;
    }

    public String getAlt() {
        return alt != null && !alt.isEmpty() ? alt : title;
    }

    public String getCourseCount() {
        return courseCount;
    }

    public String getCourseLabel() {
        return "1".equals(courseCount) ? "course" : "courses";
    }

    public String getDuration() {
        return duration;
    }

    public String getLink() {
        return link;
    }

    public boolean isEmpty() {
        return title == null || title.isEmpty();
    }
}
