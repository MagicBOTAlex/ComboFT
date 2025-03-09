# ZConnector because I'm bad with naming. Check out my ZSwitch MMU for my Bambu P1S
# This just contains helper functions to interface with the ETVR backend. I'm not touching rust lol.

import cv2
import os
import pywintypes
import win32com.client

# Doesn't support Linux, but I want to.
# When Quest 2 is more supported on Linux. I will. But if not, then someone else pls do it. 
def get_camera_devices():
    camera_list = []
    
    wmi = win32com.client.GetObject("winmgmts://./root/CIMV2")
    cameras = wmi.ExecQuery("SELECT * FROM Win32_PnPEntity WHERE Description LIKE '%camera%' OR Description LIKE '%video%'")

    for index, camera in enumerate(cameras):
        camera_list.append((index, camera.Name))  # Store index and name

    return camera_list