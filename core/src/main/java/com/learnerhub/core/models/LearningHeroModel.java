package com.learnerhub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class)
public class LearningHeroModel {

    @ValueMapValue
    @Optional
    private String title;

    @ValueMapValue
    @Optional
    private String description;

    @ValueMapValue
    @Optional
    private String fileReference;

    @ValueMapValue
    @Optional
    private String ctaText;

    @ValueMapValue
    @Optional
    private String ctaLink;

    @ValueMapValue
    @Optional
    private String level;

    @ValueMapValue
    @Optional
    private String duration;

    public String getLevel() {
        return level;
    }

    public String getDuration() {
        return duration;
    }

    // "Beginner | 4 Hours", or whichever of the two is filled in
    public String getLevelAndDuration() {
        boolean hasLevel = level != null && !level.isEmpty();
        boolean hasDuration = duration != null && !duration.isEmpty();
        if (hasLevel && hasDuration) {
            return level + " | " + duration;
        }
        return hasLevel ? level : (hasDuration ? duration : null);
    }

    // Adds .html to internal page paths and falls back to # when no link is set
    public String getCtaHref() {
        if (ctaLink == null || ctaLink.trim().isEmpty()) {
            return "#";
        }
        String link = ctaLink.trim();
        boolean internalPage = link.startsWith("/content/") && !link.contains(".");
        return internalPage ? link + ".html" : link;
    }
    @ValueMapValue
    @Optional
    private boolean courseVariant;

    public boolean isCourseVariant() {
        return courseVariant;
    }
    public String getTitle() {
        return title;
    }

    // Splits "Grow Your Skills.Build Your Future" into one line per sentence
    public String[] getTitleLines() {
        if (title == null) {
            return new String[0];
        }
        return title.trim().split("(?<=\\.)\\s*(?=\\S)");
    }

    public String getDescription() {
        return description;
    }

    public String getFileReference() {
        return fileReference;
    }

    public String getCtaText() {
        return ctaText;
    }

    public String getCtaLink() {
        return ctaLink;
    }

    public boolean isEmpty() {
        return (title == null || title.isEmpty()) && (description == null || description.isEmpty());
    }
}
