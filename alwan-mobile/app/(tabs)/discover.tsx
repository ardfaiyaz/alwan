import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const serviceCategories = [
    {
      title: 'Financial Services',
      items: [
        { id: 'kabalikat', name: 'Kabalikat', icon: 'people', color: '#047857' },
        { id: 'individual', name: 'Individual', icon: 'person', color: '#047857' },
        { id: 'insure', name: 'MBS', icon: 'shield-checkmark', color: '#047857' },
        { id: 'save', name: 'CBU', icon: 'wallet', color: '#047857' },
      ]
    },
    {
      title: 'Social & Development',
      items: [
        { id: 'scholar', name: 'Scholarship', icon: 'school', color: '#047857' },
        { id: 'outreach', name: 'Outreach', icon: 'heart', color: '#047857' },
        { id: 'center', name: 'Center Map', icon: 'map', color: '#047857' },
        { id: 'finlit', name: 'Training', icon: 'book', color: '#047857' },
      ]
    }
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* KMBI Green Header (GCash Layout) */}
      <View className="bg-[#047857] pt-12 pb-4 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-2xl font-bold">Explore KMBI</Text>
          <TouchableOpacity onPress={() => Alert.alert('Search', 'Find services')}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar - Style matching GCash Explore but with KMBI colors */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm border border-emerald-50">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 text-gray-800"
            placeholder="Search loans, programs, services..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Categories Section - KMBI Green Icons */}
        {serviceCategories.map((category, idx) => (
          <View key={idx} className="px-6 pt-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">{category.title}</Text>
            <View className="flex-row flex-wrap justify-between">
              {category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  className="items-center mb-6"
                  style={{ width: '22%' }}
                  onPress={() => Alert.alert(item.name, `${item.name} details coming soon`)}
                >
                  <View className="w-14 h-14 bg-white border border-emerald-50 rounded-full items-center justify-center shadow-sm mb-2">
                    <Ionicons name={item.icon as any} size={28} color={item.color} />
                  </View>
                  <Text className="text-gray-700 text-[11px] font-bold text-center" numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="h-px bg-gray-100 mt-2" />
          </View>
        ))}

        {/* Featured Banner - KMBI Green & Orange */}
        <View className="px-6 py-8">
          <Text className="text-gray-800 text-lg font-bold mb-4">What's New</Text>
          <TouchableOpacity
            className="bg-white border border-emerald-50 rounded-2xl overflow-hidden shadow-sm"
            onPress={() => Alert.alert('Scholarship', 'KMBI Educational Support 2026')}
          >
            <LinearGradient
              colors={['#047857', '#059669']}
              className="px-6 py-6"
            >
              <Text className="text-white text-xl font-bold">KMBI Scholarship 2026</Text>
              <Text className="text-white/80 text-sm mt-1">KMBI support for members' kids</Text>
              <View className="mt-4 bg-[#F97316] self-start px-4 py-1.5 rounded-full shadow-sm">
                <Text className="text-white text-xs font-bold uppercase tracking-tight">Apply Now</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* FAQ Section - KMBI Hybrid Style */}
        <View className="px-6 pb-12">
          <Text className="text-gray-800 text-lg font-bold mb-4">Helpful Guides</Text>
          {[
            { q: 'How to apply for Kabalikat Loan?', icon: 'cash' },
            { q: 'Registering for KMBI-MBS', icon: 'shield' },
            { q: 'Using your CBU for savings', icon: 'wallet' }
          ].map((guide, i) => (
            <TouchableOpacity
              key={i}
              className="flex-row items-center py-4 border-b border-gray-50"
              onPress={() => Alert.alert('Guide', guide.q)}
            >
              <View className="w-8 h-8 bg-emerald-50 rounded-full items-center justify-center mr-3">
                <Ionicons name={guide.icon as any} size={16} color="#047857" />
              </View>
              <Text className="flex-1 text-gray-700 font-medium text-sm">{guide.q}</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
