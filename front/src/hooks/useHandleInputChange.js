
/**
 * @name useFormInput
 * @description Custom hook that provides a handler function to update specific form fields.
 * 
 * @param {Function} setFormState
 * @returns 
 */
const useFormInput = (setFormState) => {
  return (field) => (e) => {
    setFormState((prev) => ({ ...prev, [field]: e.target.value }));
  }
} 

export default useFormInput