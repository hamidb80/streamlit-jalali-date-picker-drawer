import streamlit as st
from jdatepick import jalali_date_picker_drawer


st.subheader("Jalali Date Picker Example")
selected1 = jalali_date_picker_drawer("1403/5/2", "1403/2/3", "1407/11/2", key="d1")
selected2 = jalali_date_picker_drawer("1403-5-2", "1403-2-3", "1407-11-2", key="d2")
selected3 = jalali_date_picker_drawer("1403 5 2", "1403 2 3", "1407 11 2", key="d3")
st.write(selected1)
st.write(selected2)
st.write(selected3)
  