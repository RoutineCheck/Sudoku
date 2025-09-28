

import React from 'react';

const GameOverModal = ({ time, mistakes, onPlayAgain }) => {
    return (
        React.createElement('div', { className: 'game-over-modal' },
            React.createElement('div', { className: 'game-over-content' },
                React.createElement('h2', null, 'Congratulations!'),
                React.createElement('p', null, 'You solved the puzzle!'),
                React.createElement('div', { className: 'game-info' },
                    React.createElement('span', null, `Time: ${time}`),
                    React.createElement('span', null, ' | '),
                    React.createElement('span', null, `Mistakes: ${mistakes}`)
                ),
                React.createElement('br'),
                React.createElement('button', { className: 'btn', onClick: onPlayAgain }, 'Play Again')
            )
        )
    );
};

export default GameOverModal;

