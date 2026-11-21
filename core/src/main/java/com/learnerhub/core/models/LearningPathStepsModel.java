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
public class LearningPathStepsModel {

    @ValueMapValue
    @Optional
    private String title;

    @ValueMapValue
    @Optional
    private String description;

    @ValueMapValue
    @Optional
    private String buttonText;

    @ValueMapValue
    @Optional
    private String buttonLink;

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

    public String getDescription() {
        return description;
    }

    public String getButtonText() {
        return buttonText;
    }

    public String getButtonLink() {
        return buttonLink;
    }

    public List<Step> getSteps() {
        return new ArrayList<>(steps);
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
