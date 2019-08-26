import React from 'react';
import { FormattedMessage } from 'react-intl';

// Intro
import libraryIntro from './intro/lib-getting-started.jpg';
import stepMove from './intro/intro1.gif';
import stepMoveSayHello from './intro/intro2.gif';

export default {
    'scratching-with-a-square': {
        name: (
            <FormattedMessage
                defaultMessage="Getting Started"
                description="Name for the 'Getting Started' how-to"
                id="gui.howtos.intro-move-sayhello-hat.name"
            />
        ),
        tags: ['help', 'stuck', 'how', 'can', 'say'],
        img: libraryIntro,
        steps: [
            {
                // video: 'apchqdve3p',
                title: (
                    <p>instruction 1</p>
                )
            },
            {
                title: (
                    <p>Instruction 2</p>
                ),
                image: stepMove,
                expected: ["event_whenflagclicked", "looks_say"]
            }, {
                title: (
                   <p>Instruction 3</p>
                ),
                image: stepMoveSayHello
            }
        ],
        urlId: 'getStarted'
    }
}