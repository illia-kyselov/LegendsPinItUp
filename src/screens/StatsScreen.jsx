import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';

export default function StatsScreen() {
    const { teams, results } = useSelector(state => state.game);

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                Результаты игры
            </Text>
            {results.map((scores, roundIndex) => (
                <View key={roundIndex} style={{ marginBottom: 5 }}>
                    <Text style={{ fontWeight: '600' }}>Раунд {roundIndex + 1}:</Text>
                    {scores.map((score, teamIndex) => (
                        <Text key={teamIndex}>
                            {teams[teamIndex]} – {score} правильных ответов
                        </Text>
                    ))}
                </View>
            ))}
        </View>
    );
}
