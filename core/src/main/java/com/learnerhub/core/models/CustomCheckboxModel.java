package com.learnerhub.core.models;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CustomCheckboxModel {

    private static final Logger LOGGER = LoggerFactory.getLogger(CustomCheckboxModel.class);

    @SlingObject
    private Resource currentResource;

    @ValueMapValue
    private String title;

    @ChildResource(name = "options")
    private List<Resource> optionResources;

    private List<CheckboxOption> options = Collections.emptyList();

    @PostConstruct
    protected void init() {
        if (optionResources == null || optionResources.isEmpty()) {
            return;
        }

        List<CheckboxOption> configuredOptions = new ArrayList<>();
        for (Resource optionResource : optionResources) {
            ValueMap properties = optionResource.getValueMap();
            String label = properties.get("label", String.class);
            if (StringUtils.isBlank(label)) {
                LOGGER.warn("Skipping checkbox option without a label on {}", currentResource.getPath());
                continue;
            }

            String value = StringUtils.defaultIfBlank(properties.get("value", String.class), label);
            configuredOptions.add(new CheckboxOption(value, label, properties.get("checked", false)));
        }
        options = Collections.unmodifiableList(configuredOptions);
    }

    public String getTitle() {
        return title;
    }

    public List<CheckboxOption> getOptions() {
        return options;
    }

    public static final class CheckboxOption {

        private final String value;
        private final String label;
        private final boolean checked;

        private CheckboxOption(String value, String label, boolean checked) {
            this.value = value;
            this.label = label;
            this.checked = checked;
        }

        public String getValue() {
            return value;
        }

        public String getLabel() {
            return label;
        }

        public boolean isChecked() {
            return checked;
        }
    }
}
