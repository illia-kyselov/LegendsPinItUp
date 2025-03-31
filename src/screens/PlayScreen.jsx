import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur'; // Для блюра
import { useSelector } from 'react-redux';
import PauseSVG from '../assets/game/PauseSVG';
import PinImage from '../assets/game/pin.png';
import { selectLegends } from '../store/slices/customLegendsSlice';

export default function PlayScreen({ navigation, route }) {
    const { firstTeam, rounds, selectedTime, chosenCategory } = route.params;
    const legends = useSelector(selectLegends);
    const legendsForCategory = legends.filter(legend => legend.category === chosenCategory);

    // Храним выбранную легенду, чтобы не обновлялась каждую секунду
    const [randomLegend, setRandomLegend] = useState({ name: 'No Legend' });
    useEffect(() => {
        if (legendsForCategory.length > 0) {
            setRandomLegend(legendsForCategory[Math.floor(Math.random() * legendsForCategory.length)]);
        }
    }, []);

    const [remainingTime, setRemainingTime] = useState(selectedTime);
    const [isPaused, setIsPaused] = useState(false);
    const [showPauseModal, setShowPauseModal] = useState(false); // отвечает за отображение модалки

    // Функция для проигрывания звука
    const playAlarm = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/music/cyber-alarm.wav')
            );
            await sound.playAsync();
        } catch (error) {
            console.error('Ошибка воспроизведения звука', error);
        }
    };

    // Таймер
    useEffect(() => {
        if (isPaused || remainingTime === 0) return;
        const interval = setInterval(() => {
            setRemainingTime(prev => {
                if (prev > 0) return prev - 1;
                clearInterval(interval);
                playAlarm();
                return 0;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [isPaused, remainingTime]);

    // Нажатие на кнопку паузы: останавливаем таймер и показываем модалку
    const handlePause = () => {
        setIsPaused(true);
        setShowPauseModal(true);
    };

    // Возобновляем таймер, скрываем модалку
    const handleContinue = () => {
        setShowPauseModal(false);
        setIsPaused(false);
    };

    // Переходим в главное меню (экран 'Main')
    const handleMainMenu = () => {
        navigation.navigate('Main');
        setShowPauseModal(false);
    };

    const progressPercent = ((selectedTime - remainingTime) / selectedTime) * 100;

    return (
        <View style={styles.background}>
            <SafeAreaView style={styles.safe}>
                <View style={styles.header}>
                    <Text style={styles.teamTitle}>{firstTeam}</Text>
                    <Text style={styles.scoreText}>1/{rounds}</Text>
                    <TouchableOpacity onPress={handlePause}>
                        <PauseSVG />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 68 }} />
                <View style={styles.cardContainer}>
                    <Text style={styles.cardText}>{randomLegend.name.toUpperCase()}</Text>
                    <Image source={PinImage} style={styles.pinImage} />
                </View>
                <View style={{ marginBottom: 28 }} />
                <Text style={styles.categoryText}>{chosenCategory.toUpperCase()}</Text>
                <View style={{ marginBottom: 106 }} />
                {remainingTime > 0 ? (
                    <>
                        <Text style={styles.timeText}>{remainingTime}:00</Text>
                        <View style={{ marginBottom: 32 }} />
                        <View style={styles.progressContainer}>
                            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
                        </View>
                    </>
                ) : (
                    // Когда время закончилось
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.incorrectButton}>
                            <Text style={styles.buttonText}>incorrect</Text>
                        </TouchableOpacity>
                        <View style={{ width: 2 }} />
                        <TouchableOpacity style={styles.correctButton}>
                            <Text style={styles.buttonText}>correct</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <View style={{ marginBottom: 36 }} />

                {/* Модалка для паузы */}
                <Modal
                    transparent
                    visible={showPauseModal}
                    animationType="fade"
                    onRequestClose={handleContinue}
                >
                    <View style={styles.modalOverlay}>
                        <BlurView style={StyleSheet.absoluteFill} intensity={24} tint="light" />
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Time-Out Called!</Text>
                            <Text style={styles.modalMessage}>
                                Even legends need a break. Take a moment, catch your breath, and get ready to dive back into the showdown when you're ready
                            </Text>
                            <View style={styles.modalButtonsRow}>
                                <TouchableOpacity style={styles.modalMainButton} onPress={handleMainMenu}>
                                    <Text style={styles.modalMainButtonText}>Main Menu</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalContinueButton} onPress={handleContinue}>
                                    <Text style={styles.modalContinueButtonText}>Continue</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#959AA4',
    },
    safe: {
        flex: 1,
        marginHorizontal: 24,
        marginTop: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    teamTitle: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        fontSize: 20,
        color: '#FFFFFF',
        maxWidth: 146,
        flexWrap: 'wrap',
    },
    scoreText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        fontSize: 20,
        color: '#FFFFFF',
    },
    cardContainer: {
        width: 274,
        height: 354,
        borderRadius: 24,
        backgroundColor: '#0048D4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        alignSelf: 'center',
    },
    cardText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        textTransform: 'uppercase',
        paddingHorizontal: 16,
    },
    pinImage: {
        position: 'absolute',
        top: -28,
        right: -18,
        width: 50,
        height: 74,
        resizeMode: 'contain',
    },
    categoryText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    timeText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        fontSize: 24,
        color: '#FFDDC8',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    progressContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#F5F5F566',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#FFDDC8',
        borderRadius: 3,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    incorrectButton: {
        flex: 1,
        height: 51,
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#D41900',
        justifyContent: 'center',
        alignItems: 'center',
    },
    correctButton: {
        flex: 1,
        height: 51,
        borderRadius: 12,
        padding: 16,
        backgroundColor: '#15D400',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '400',
        fontSize: 16,
        color: '#FCF9EA',
        textTransform: 'uppercase',
    },

    /* ====== Модалка паузы ====== */
    modalOverlay: {
        flex: 1,
        backgroundColor: '#00000040', // полупрозрачный фон
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: 345,
        height: 249,
        borderRadius: 20,
        paddingTop: 32,
        paddingRight: 24,
        paddingBottom: 32,
        paddingLeft: 24,
        backgroundColor: '#FFDDC8',
        borderWidth: 1,
        borderColor: '#BABABA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '600',
        fontSize: 22,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 4,
    },
    modalMessage: {
        fontFamily: 'Inter',
        fontWeight: '400',
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
        marginBottom: 36,
    },
    modalButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalMainButton: {
        height: 43,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        flex: 1,
        backgroundColor: 'transparent', // нет фона, текст чёрный
    },
    modalMainButtonText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '500',
        fontSize: 16,
        color: '#000000',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    modalContinueButton: {
        height: 43,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        flex: 1,
        backgroundColor: '#0048D4',
    },
    modalContinueButtonText: {
        fontFamily: 'Montserrat Alternates',
        fontWeight: '400',
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});
