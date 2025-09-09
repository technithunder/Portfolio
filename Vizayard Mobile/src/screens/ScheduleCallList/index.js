import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../../components';
import { commonSty } from '../../theme';

const callData = [
  {
    id: 1,
    title: 'Akash Solanki',
    date: '2023-10-01',
    time: '10:00 AM',
    status: 'Upcoming',
  },
  {
    id: 2,
    title: 'John Doe',
    date: '2023-10-02',
    time: '11:00 AM',
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Jane Smith',
    date: '2023-10-03',
    time: '12:00 PM',
    status: 'Upcoming',
  },
  {
    id: 4,
    title: 'Jane Smith',
    date: '2023-10-03',
    time: '12:00 PM',
    status: 'Completed',
  },
  {
    id: 5,
    title: 'Jane Smith',
    date: '2023-10-03',
    time: '12:00 PM',
    status: 'Completed',
  },
  {
    id: 6,
    title: 'Jane Smith',
    date: '2023-10-03',
    time: '12:00 PM',
    status: 'Completed',
  },
  {
    id: 7,
    title: 'Jane Smith',
    date: '2023-10-03',
    time: '12:00 PM',
    status: 'Upcoming',
  },
];

const StatusBadge = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'Upcoming':
        return { color: '#FFC107', icon: 'schedule' };
      case 'Completed':
        return { color: '#4CAF50', icon: 'check-circle' };
      default:
        return { color: '#9E9E9E', icon: 'help-outline' };
    }
  };

  const { color, icon } = getStatusInfo();

  return (
    <View style={[styles.statusBadge, { backgroundColor: color }]}>
      <MaterialIcons name={icon} size={16} color="#FFF" />
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const ScheduleCallList = () => {
  const handleEdit = (id) => {
    console.log('Edit:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete:', id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.detailRow}>
        <MaterialIcons name="event" size={18} color="#666" />
        <Text style={styles.detailText}>{item.date}</Text>
      </View>

      <View style={styles.detailRow}>
        <MaterialIcons name="access-time" size={18} color="#666" />
        <Text style={styles.detailText}>{item.time}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEdit(item.id)}>
          <MaterialIcons name="edit" size={22} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
          <MaterialIcons name="delete" size={22} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Container title="Scheduled Calls" showBack containerStyle={commonSty.flex}>
      <View>
        {callData.length > 0 ? (
          <FlatList
            data={callData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="event-busy" size={60} color="#BDBDBD" />
            <Text style={styles.emptyText}>No scheduled calls</Text>
          </View>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#4F4F4F',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 5,
  },
  actionBtn: {
    marginLeft: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#BDBDBD',
    marginTop: 12,
  },
});

export default ScheduleCallList;
