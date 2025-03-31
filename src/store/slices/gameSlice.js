// Пример Redux-слайса для игры (используем Redux Toolkit)
import { createSlice } from '@reduxjs/toolkit';
const gameSlice = createSlice({
    name: 'game',
    initialState: {
        teams: [],           // имена команд
        roundsCount: 0,      // общее число раундов
        timePerTurn: 0,      // время на раунд (секунды)
        currentRound: 0,     // индекс текущего раунда (0-based)
        currentTeam: 0,      // индекс текущей команды (0-based)
        results: []          // результаты: [раунд][команда] = кол-во правильных ответов
    },
    reducers: {
        initializeGame: (state, action) => {
            const { teams, roundsCount, timePerTurn } = action.payload;
            state.teams = teams;
            state.roundsCount = roundsCount;
            state.timePerTurn = timePerTurn;
            state.currentRound = 0;
            state.currentTeam = 0;
            // Создаем матрицу результатов roundsCount x teamsCount, заполненную 0
            state.results = Array.from({ length: roundsCount },
                () => Array(teams.length).fill(0));
        },
        // ... другие редюсеры добавим ниже
    }
});
export const { initializeGame, recordAnswer } = gameSlice.actions;
export default gameSlice.reducer;
