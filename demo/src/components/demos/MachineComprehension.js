import React from 'react';
import HeatMap from '../HeatMap'
import Collapsible from 'react-collapsible'
import { withRouter } from 'react-router-dom';
import Model from '../Model'
import OutputField from '../OutputField'
import { API_ROOT } from '../../api-config';

const title = "Machine Comprehension"

const description = (
    <span>
      <span>
        Machine Comprehension (MC) answers natural language questions by selecting an answer span within an evidence text.
        The AllenNLP toolkit provides the following MC visualization, which can be used for any MC model in AllenNLP.
        This page demonstrates a reimplementation of
      </span>
      <a href = "https://www.semanticscholar.org/paper/Bidirectional-Attention-Flow-for-Machine-Comprehen-Seo-Kembhavi/007ab5528b3bd310a80d553cccad4b78dc496b02" target="_blank" rel="noopener noreferrer">{' '} BiDAF (Seo et al, 2017)</a>
      <span>
        , or Bi-Directional Attention Flow,
        a widely used MC baseline that achieved state-of-the-art accuracies on
      </span>
      <a href = "https://rajpurkar.github.io/SQuAD-explorer/" target="_blank" rel="noopener noreferrer">{' '} the SQuAD dataset {' '}</a>
      <span>
        (Wikipedia sentences) in early 2017.
      </span>
    </span>
  )

const fields = [
    {name: "passage", label: "Passage", type: "TEXT_AREA",
     placeholder: `E.g. "Saturn is the sixth planet from the Sun and the second-largest in the Solar System, after Jupiter. It is a gas giant with an average radius about nine times that of Earth. Although it has only one-eighth the average density of Earth, with its larger volume Saturn is just over 95 times more massive. Saturn is named after the Roman god of agriculture; its astronomical symbol represents the god's sickle"`},
    {name: "question", label: "Question", type: "TEXT_INPUT",
     placeholder: `E.g. "What does Saturn’s astronomical symbol represent"`}
]


const Output = ({ requestData, responseData }) => {
    const { passage } = requestData
    const { best_span_str, passage_question_attention, question_tokens, passage_tokens } = responseData
    const start = passage.indexOf(best_span_str);
    const head = passage.slice(0, start);
    const tail = passage.slice(start + best_span_str.length);

    return (
        <div className="model__content">
            <OutputField label="Answer">
            {best_span_str}
            </OutputField>

            <OutputField label="Passage Context" classes="passage">
                <span>{head}</span>
                <span className="passage__answer">{best_span_str}</span>
                <span>{tail}</span>
            </OutputField>

            <OutputField>
            <Collapsible trigger="Model internals (beta)">
                <Collapsible trigger="Passage to Question attention">
                    <span>
                    For every passage word, the model computes an attention over the question words.
                    This heatmap shows that attention, which is normalized for every row in the matrix.
                    </span>
                    <HeatMap colLabels={question_tokens} rowLabels={passage_tokens} data={passage_question_attention} />
                </Collapsible>
            </Collapsible>
            </OutputField>
        </div>
    )
}


const examples = [
    {
      passage: "A reusable launch system (RLS, or reusable launch vehicle, RLV) is a launch system which is capable of launching a payload into space more than once. This contrasts with expendable launch systems, where each launch vehicle is launched once and then discarded. No completely reusable orbital launch system has ever been created. Two partially reusable launch systems were developed, the Space Shuttle and Falcon 9. The Space Shuttle was partially reusable: the orbiter (which included the Space Shuttle main engines and the Orbital Maneuvering System engines), and the two solid rocket boosters were reused after several months of refitting work for each launch. The external tank was discarded after each flight.",
      question: "How many partially reusable launch systems were developed?",
    },
    {
      passage: "Robotics is an interdisciplinary branch of engineering and science that includes mechanical engineering, electrical engineering, computer science, and others. Robotics deals with the design, construction, operation, and use of robots, as well as computer systems for their control, sensory feedback, and information processing. These technologies are used to develop machines that can substitute for humans. Robots can be used in any situation and for any purpose, but today many are used in dangerous environments (including bomb detection and de-activation), manufacturing processes, or where humans cannot survive. Robots can take on any form but some are made to resemble humans in appearance. This is said to help in the acceptance of a robot in certain replicative behaviors usually performed by people. Such robots attempt to replicate walking, lifting, speech, cognition, and basically anything a human can do.",
      question: "What do robots that resemble humans attempt to do?",
    },
    {
      passage: "The Matrix is a 1999 science fiction action film written and directed by The Wachowskis, starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano. It depicts a dystopian future in which reality as perceived by most humans is actually a simulated reality called \"the Matrix\", created by sentient machines to subdue the human population, while their bodies' heat and electrical activity are used as an energy source. Computer programmer \"Neo\" learns this truth and is drawn into a rebellion against the machines, which involves other people who have been freed from the \"dream world.\"",
      question: "Who stars in The Matrix?",
    },
    {
      passage: "Kerbal Space Program (KSP) is a space flight simulation video game developed and published by Squad for Microsoft Windows, OS X, Linux, PlayStation 4, Xbox One, with a Wii U version that was supposed to be released at a later date. The developers have stated that the gaming landscape has changed since that announcement and more details will be released soon. In the game, players direct a nascent space program, staffed and crewed by humanoid aliens known as \"Kerbals\". The game features a realistic orbital physics engine, allowing for various real-life orbital maneuvers such as Hohmann transfer orbits and bi-elliptic transfer orbits.",
      question: "What does the physics engine allow for?",
    }
];

const apiUrl = () => `${API_ROOT}/predict/machine-comprehension`

const modelProps = {apiUrl, title, description, fields, examples, Output}

export default withRouter(props => <Model {...props} {...modelProps}/>)

