import { ref, onMounted, watch } from 'vue';

export default function useSelectableList(list, selected) {
  const selectedRef = ref(selected);
  const selectedIndexRef = ref(selectedRef.value.index);
  const selectedItemRef = ref(selectedRef.value.item);

  watch(selectedRef, (newValue) => {
    selectedIndexRef.value = newValue.index;
    selectedItemRef.value = newValue.item;
  });

  onMounted(() => {
    selectedIndexRef.value = selectedRef.value.index;
    selectedItemRef.value = selectedRef.value.item;
  });

  return {
    selectedRef,
    selectedIndexRef,
    selectedItemRef,
    list,
  };
}