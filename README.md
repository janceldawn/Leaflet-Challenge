# Leaflet-Challenge

## Table of Content
-index.html
-style.css
-logic.js


## References of code sourced from
- Monash Lesson Plans - Mapping
- ChatGPT
- AskBCs
-The following codes below were generated with the assistance of AskBCs. Displaying gradient color scale and labels on the legend
-ASKBCs LA Peter
## start code

labels.push(
                `<i style="background: ${color}"></i> ${from}${to ? "&ndash;" + to : "+"}`
            );

            // Store colours in an array
            colors.push(color);
        }

        // Create a gradient color scale
        div.style.background = `linear-gradient(to right, ${colors.join(", ")})`; 

         // Add labels to the legend
        div.innerHTML = labels.join(""); 
        return div;
    };

    legend.addTo(map);
}

## end code

