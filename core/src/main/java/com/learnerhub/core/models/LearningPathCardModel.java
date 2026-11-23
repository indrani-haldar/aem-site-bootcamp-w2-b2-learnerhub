package com.learnerhub.core.models;

import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
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

    @ValueMapValue
    @Optional
    private String description;

    @SlingObject
    private Resource resource;

    private final List<Step> steps = new ArrayList<>();

    @PostConstruct
    protected void init() {
        Resource stepsResource = resource.getChild("steps");
        if (stepsResource == null) {
            return;
        }
        for (Resource child : stepsResource.getChildren()) {
            String stepTitle = child.getValueMap().get("title", String.class);
            if (stepTitle != null && !stepTitle.isEmpty()) {
                steps.add(new Step(stepTitle, child.getValueMap().get("duration", String.class)));
            }
        }
    }

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

    public String getDescription() {
        return description;
    }

    public List<Step> getSteps() {
        return new ArrayList<>(steps);
    }

    public boolean isEmpty() {
        return title == null || title.isEmpty();
    }

    public static final class Step {

        private final String title;
        private final String duration;

        Step(String title, String duration) {
            this.title = title;
            this.duration = duration;
        }

        public String getTitle() {
            return title;
        }

        public String getDuration() {
            return duration;
        }
    }
}
