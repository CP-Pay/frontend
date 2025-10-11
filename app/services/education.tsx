import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { spacing, borderRadius } from '@/constants/Typography';

export default function EducationScreen() {
  const router = useRouter();
  const [institution, setInstitution] = useState('');
  const [studentId, setStudentId] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const handleProceed = () => {
    if (!institution || !studentId || !amount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Coming Soon', 'Education payment will be processed via TransactionService');
  };

  return (
    <LinearGradient colors={[Colors.backgroundGradient1, Colors.backgroundGradient2, Colors.backgroundGradient3]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Education Payment</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Institution</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={institution ? styles.text : styles.placeholder}>{institution || 'Select institution'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Student ID / Matric Number</Text>
            <TextInput style={styles.input} placeholder="Enter student ID" placeholderTextColor={Colors.textSecondary} value={studentId} onChangeText={setStudentId} />
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Purpose</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={purpose ? styles.text : styles.placeholder}>{purpose || 'School fees, Exam fees, etc.'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Amount (₦)</Text>
            <TextInput style={styles.input} placeholder="Enter amount" placeholderTextColor={Colors.textSecondary} keyboardType="numeric" value={amount} onChangeText={setAmount} />
          </View>
          <TouchableOpacity style={[styles.button, (!institution || !studentId || !amount) && styles.buttonDisabled]} onPress={handleProceed}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255, 255, 255, 0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, paddingHorizontal: spacing.lg },
  section: { marginBottom: spacing.lg },
  label: { fontSize: 16, fontWeight: '600', color: '#fff', marginBottom: spacing.sm },
  input: { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: 16, color: '#fff', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  text: { color: '#fff' },
  placeholder: { color: Colors.textSecondary },
  button: { backgroundColor: Colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.md },
  buttonDisabled: { backgroundColor: 'rgba(76, 175, 80, 0.3)' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
