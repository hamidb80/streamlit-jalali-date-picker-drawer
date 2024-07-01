import os
from typing import Tuple
import streamlit.components.v1 as components


# config --------------------------------------

pkg_name = "jalali-date-picker-drawer"
dev_server = os.getenv('JALALI_DATA_PICKER_DEV_SERVER') # e.g. "http://localhost:3001"

if dev_server:
    print(f"---- {pkg_name} debug mode ------")
    print(f"---- server: {dev_server}")
    component_fn = components.declare_component(pkg_name, url=dev_server)

else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "jdatepick")
    component_fn = components.declare_component(pkg_name, path=build_dir)

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
        joiner: str = '/',
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
        joiner = joiner,
        
        close_on_select_day = close_on_select_day,

        key=key, 
        default=default)
