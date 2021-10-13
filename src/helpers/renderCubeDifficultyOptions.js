module.exports = function (difficultyLvl) {
    const difficultiesMap = {
        1: '1 - Very Easy',
        2: '2 - Easy',
        3: '3 - Medium (Standard 3x3)',
        4: '4 - Intermediate',
        5: '5 - Expert',
        6: '6 - Hardcore'
    };

    return (function (options = []) {
        for (let i = 1; i <= 6; i++) {
            const option = { value: i, text: difficultiesMap[i] };
            const isSelected = difficultyLvl === i;

            if (isSelected) {
                option.selected = isSelected;
            }

            options.push(option);
        }

        return options;
    })();
};