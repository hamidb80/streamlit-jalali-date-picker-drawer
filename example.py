import streamlit as st
from jdatepick import jalali_date_picker_drawer


st.subheader("Jalali Date Picker Example")
selected = jalali_date_picker_drawer((1403, 5, 2), (1403, 2, 3), (1407, 11, 2))
st.write(selected)
