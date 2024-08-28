//helper functions go here
function range(start=0,end){
  return [...Array(end-start).keys()].map(i => i + start);
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function dist_between_points(x1,y1,x2,y2){
  return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}



// code is based on Temilade Adekoya's plugin-ChangeLoc plugin
var jsPsychColorChangeLoc = (function (jspsych) {
    "use strict";
   
    const info = {
      name: "ColorChangeLocalizationPlugin",
      version: "1.0.0", // When working in a Javascript environment with no build, you will need to manually put set the version information. This is used for metadata purposes and publishing.
      parameters: {

        /** The duration of fixation prior to stimulus presentation */
        fixation_duration: {
          type: jspsych.ParameterType.INT,
          default: 1000,
          pretty_name: "Fixation duration",
        },
        /** The number of TOTAL colors to show in the stimulus display*/
        n_colors: {
          type: jspsych.ParameterType.INT,
          default: 6,
          pretty_name: "Number of colors",
        },

        /** Colors which can appear (hex) */
        colors: {
          type: jspsych.ParameterType.STRING,
          pretty_name: "Colors",
          default: [
            "#c9281c",
            "#f0e10c",
            "#158009",
            "#062a9e",
            "#00FFFF",
            "#FF00FF",
            "#000000",
            "#FFFFFF",
          ],
        },
        /** The duration of the stimulus display */
        stim: {
          type: jspsych.ParameterType.INT,
          default: 250,
          pretty_name: "Stimulus duration",
        }
      },
    data: {
      /** name of this trial */
      trial_exp: {
        type: jspsych.ParameterType.STRING,
      },

      /** Response key pressed */
      key: {
        type: jspsych.ParameterType.KEY,
      },

      /** Reaction Time */
      rt: {
        type: jspsych.ParameterType.INT,
      },

      /** Colors presented */
      stimuli: {
        type: jspsych.ParameterType.OBJECT,
      },

      /** Color positions */
      positions: {
        type: jspsych.ParameterType.OBJECT,
      },

      /** Index of the test */
      test_index: {
        type: jspsych.ParameterType.INT,
      },
      /** Test item */
      test_item: {
        type: jspsych.ParameterType.STRING,
      },
      /** Correct answer */
      correct_answer: {
        type: jspsych.ParameterType.STRING,
      },
      /** Array of responses */
      response_array: {
        type: jspsych.ParameterType.OBJECT,
        default: [],
      },
      /** Number of colors */
      n_colors: {
        type: jspsych.ParameterType.INT,
      },
    }
  };

  
    /**
     * **{plugin-color-changeloc}**
     *
     * A plugin to run color change localization experiments of varying set sizes
     * Display stimuli simultaneously, then test on a array of the same with one changed
     *
     * @author Darius Suplica
     * @see {@link {https://github.com/dsuplica/change-localization-jspsych-plugins-url}}
     */
    class ColorChangeLocPlugin {
      constructor(jsPsych) {
        this.jsPsych = jsPsych;
      }


      trial(display_element, trial) {
        let test_index; // index of item to be changed
        let test_item; // new value for changed item
        let response_array = range(1, trial.n_colors + 1); // array of possible responses
        const canvasSize = 600;
        const edge_buffer = 50; 
        const stim_size = 40;


        // MAIN EXPERIMENT CODE


        //CREATE CANVAS OBJECT//
      display_element.innerHTML =
      "<div id='jspsych-changeloc-plugin' style='position: relative; width:" +
      canvasSize +
      "px; height:" +
      canvasSize +
      "px'></div>";
      display_element.querySelector("#jspsych-changeloc-plugin").innerHTML +=
        "<canvas id='c', width = '" +
        canvasSize +
        "', height = '" +
        canvasSize +
        "'/canvas>";

      //CREATE FABRIC OBJECT//
      let canvas = new fabric.Canvas("c");
      canvas.set({
        renderOnAddRemove: false,
        selection: false,
        backgroundColor: "#9E9E9E",
      });

      function show_fixation() {
        //SHOW FIXATION CROSS//
        let fixation = new fabric.Text("+", {
          id: "fixation",
          fill: "#FFFFFF",
          fontSize: 30,
          hasBorders: false,
          hasControls: false,
          hoverCursor: "default",
          lockMovementX: true,
          lockMovementY: true,
        });
        canvas.add(fixation);
        fixation.center();
        canvas.requestRenderAll();
      }


      // GET POSITION ARRAYS


      let position_array = [];


      while (position_array.length < trial.n_colors) {

        let x = randomNumber(edge_buffer, canvasSize - edge_buffer);
        let y = randomNumber(edge_buffer, canvasSize - edge_buffer);


        





      }















        // data saving
        var trial_data = {
          data1: 99, // Make sure this type and name matches the information for data1 in the data object contained within the info const.
          data2: "hello world!", // Make sure this type and name matches the information for data2 in the data object contained within the info const.
        };
        // end trial
        this.jsPsych.finishTrial(trial_data);
      }
    }
    PluginNamePlugin.info = info;
  
    return PluginNamePlugin;
  })(jsPsychModule);