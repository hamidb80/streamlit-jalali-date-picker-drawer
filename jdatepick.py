import os
from typing import Tuple
import streamlit.components.v1 as components


# config --------------------------------------

release_mode = os.getenv('JALALI_DATA_PICKER_DEBUG', "") == ""

if not release_mode:
    component_fn = components.declare_component(
        "jalali-date-picker-drawer", 
        url="http://localhost:3001")

else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "jdatepick")
    component_fn = components.declare_component("jdatepick", path=build_dir)

# types ------------------------------------------

Year = int
Month = int
Day = int
Date = Tuple[Year, Month, Day]

# component --------------------------------------

def jalali_date_picker_drawer(
        default: Date, 
        start: Date, 
        end: Date, 
        close_on_select_day: bool = True, 
        key=None
):
    """
    select from 1402-7-3 to 1407-11-2 with default day of 1403-6-10 

    [year, month, day] = jalali_date_picker_drawer(
        (1403, 6, 10), 
        (1402, 7, 3), 
        (1407, 11, 2))
    """

    return component_fn(
        selected=default,
        start=start, 
        end=end, 
        
        close_on_select_day = close_on_select_day,

        key=key, 
        default=default)
