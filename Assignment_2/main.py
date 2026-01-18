import sys
try:
    from OpenGL.GL import *
    from OpenGL.GLU import *
    from OpenGL.GLUT import *
    import numpy as np
    import tkinter as tk
    import threading
except:
    print("Error: PyOpengl was not instanlled correctly")
    sys.exit()




class myGraphics (object):
    ### Initiate the all variable needed
    def __init__(self) -> None:
        ## Window size initiate
        self.width = 1200
        self.height = 800
        
        self.speed_scale = 1.0
        self.move_direction = [0,0,0]
        self.current_position = [0,0,0]

        self.initiateVariable()
        self.initiateColor()
        self.initiatePattern()
        
        self.process_command_line_args()
        
    
    def initiateVariable(self) -> None:
        self.useRGB = True
        
        self.lighting_update = False
        self.useLighting = True
        
        self.useFog = False
        self.useDB = True
        self.useLogo = False
        self.useQuads = True
        
        self.tick = -1
        self.moving = True
        

    # Display list variables for checkerboard
        self.checklist_initialized = False
        self.checklist = 0
        self.usedLighting_check = False  
    def initiateColor(self) -> None:
        # Color constants
        self.GREY = 0
        self.RED = 1
        self.GREEN = 2
        self.BLUE = 3
        self.CYAN = 4
        self.MAGENTA = 5
        self.YELLOW = 6
        self.BLACK = 7
        self.cubeColor = self.RED
        
        
        self.materialColor = [
            [0.8, 0.8, 0.8, 1.0],
            [0.8, 0.0, 0.0, 1.0],
            [0.0, 0.8, 0.0, 1.0],
            [0.0, 0.0, 0.8, 1.0],
            [0.0, 0.8, 0.8, 1.0],
            [0.8, 0.0, 0.8, 1.0],
            [0.8, 0.8, 0.0, 1.0],
            [0.0, 0.0, 0.0, 0.6],
        ]

        
        self.lightPosDefault = [2.0, 4.0, 2.0, 1.0]
        self.lightPosControl = [2.0, 4.0, 2.0, 1.0]
        self.lightPos = [2.0, 4.0, 2.0, 1.0]
        self.lightAmb = [0.2, 0.2, 0.2, 1.0]
        self.lightDiff = [0.8, 0.8, 0.8, 1.0]
        self.lightSpec = [0.4, 0.4, 0.4, 1.0]

        self.groundPlane = [0.0, 1.0, 0.0, 1.499]
        self.backPlane = [0.0, 0.0, 1.0, 0.899]

        self.fogColor = [0.3, 0.3, 0.3, 0.0]
        self.fog_mode = GL_EXP
        self.fog_update = False   
    def initiatePattern(self) -> None:
        self.shadowPattern = bytes([
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55,
            0xaa, 0xaa, 0xaa, 0xaa, 0x55, 0x55, 0x55, 0x55
        ])

        self.sgiPattern = bytes([
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
            0xff, 0xbd, 0xff, 0x83, 0xff, 0x5a, 0xff, 0xef,
            0xfe, 0xdb, 0x7f, 0xef, 0xfd, 0xdb, 0xbf, 0xef,
            0xfb, 0xdb, 0xdf, 0xef, 0xf7, 0xdb, 0xef, 0xef,
            0xfb, 0xdb, 0xdf, 0xef, 0xfd, 0xdb, 0xbf, 0x83,
            0xce, 0xdb, 0x73, 0xff, 0xb7, 0x5a, 0xed, 0xff,
            0xbb, 0xdb, 0xdd, 0xc7, 0xbd, 0xdb, 0xbd, 0xbb,
            0xbe, 0xbd, 0x7d, 0xbb, 0xbf, 0x7e, 0xfd, 0xb3,
            0xbe, 0xe7, 0x7d, 0xbf, 0xbd, 0xdb, 0xbd, 0xbf,
            0xbb, 0xbd, 0xdd, 0xbb, 0xb7, 0x7e, 0xed, 0xc7,
            0xce, 0xdb, 0x73, 0xff, 0xfd, 0xdb, 0xbf, 0xff,
            0xfb, 0xdb, 0xdf, 0x87, 0xf7, 0xdb, 0xef, 0xfb,
            0xf7, 0xdb, 0xef, 0xfb, 0xfb, 0xdb, 0xdf, 0xfb,
            0xfd, 0xdb, 0xbf, 0xc7, 0xfe, 0xdb, 0x7f, 0xbf,
            0xff, 0x5a, 0xff, 0xbf, 0xff, 0xbd, 0xff, 0xc3,
            0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff
        ])
        
        self.cube_vertexes = [
            [
                [-1.0, -1.0, -1.0, 1.0],
                [-1.0, -1.0, 1.0, 1.0],
                [-1.0, 1.0, 1.0, 1.0],
                [-1.0, 1.0, -1.0, 1.0]
            ],
            [
                [1.0, 1.0, 1.0, 1.0],
                [1.0, -1.0, 1.0, 1.0],
                [1.0, -1.0, -1.0, 1.0],
                [1.0, 1.0, -1.0, 1.0]
            ],
            [
                [-1.0, -1.0, -1.0, 1.0],
                [1.0, -1.0, -1.0, 1.0],
                [1.0, -1.0, 1.0, 1.0],
                [-1.0, -1.0, 1.0, 1.0]
            ],
            [
                [1.0, 1.0, 1.0, 1.0],
                [1.0, 1.0, -1.0, 1.0],
                [-1.0, 1.0, -1.0, 1.0],
                [-1.0, 1.0, 1.0, 1.0]
            ],
            [
                [-1.0, -1.0, -1.0, 1.0],
                [-1.0, 1.0, -1.0, 1.0],
                [1.0, 1.0, -1.0, 1.0],
                [1.0, -1.0, -1.0, 1.0]
            ],
            [
                [1.0, 1.0, 1.0, 1.0],
                [-1.0, 1.0, 1.0, 1.0],
                [-1.0, -1.0, 1.0, 1.0],
                [1.0, -1.0, 1.0, 1.0]
            ]
        ]

        self.cube_normals = [
            [-1.0, 0.0, 0.0],
            [1.0, 0.0, 0.0],
            [0.0, -1.0, 0.0],
            [0.0, 1.0, 0.0],
            [0.0, 0.0, -1.0],
            [0.0, 0.0, 1.0]
        ]
        
    ### Initaite Scene state
    def initScene(self) -> None:
        glClearColor(0.0, 0.0, 0.0, 1.0)    # clear the color of the window
        glClearDepth(1.0)
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()
    ### Initiate standard command line 
    def process_command_line_args(self):
        for arg in sys.argv[1:]:
            if arg == '-c': self.useRGB = not self.useRGB
            elif arg == '-l': self.useLighting = not self.useLighting
            elif arg == '-f': self.useFog = not self.useFog
            elif arg == '-db': self.useDB = not self.useDB
            elif arg == '-logo': self.useLogo = not self.useLogo
            elif arg == '-quads': self.useQuads = not self.useQuads
    
    
    ### Set the color depends on the lighting state
    def setColor(self, c) -> None:
        if self.useLighting:
            glMaterialfv(GL_FRONT_AND_BACK, GL_AMBIENT_AND_DIFFUSE, self.materialColor[c])
        else:
            glColor4fv(self.materialColor[c])
    ### Draw the 3D cube
    def drawCube(self, color) -> None:
        self.setColor(color)
        for i in range(6):
            glNormal3fv(self.cube_normals[i])
            glBegin(GL_POLYGON)
            for vertex in self.cube_vertexes[i]:
                glVertex4fv(vertex)
            glEnd()
    
    ## Draw the square(ground and wall)
    def drawCheck(self, w, h, even_color, odd_color) -> None:
        
        square_normal = [0.0, 0.0, 1.0]
        if not self.checklist_initialized or (self.usedLighting_check != self.useLighting):
            if not self.checklist_initialized:
                self.checklist = glGenLists(1)
                self.checklist_initialized = True
            glNewList(self.checklist, GL_COMPILE_AND_EXECUTE)
            if self.useQuads:
                glNormal3fv(square_normal)
                glBegin(GL_QUADS)
            
            for j in range(h):
                for i in range(w):
                    vertices = [
                        [-1 + 2*i/w, -1 + 2*(j+1)/h, 0, 1],
                        [-1 + 2*i/w, -1 + 2*j/h,     0, 1],
                        [-1 + 2*(i+1)/w, -1 + 2*j/h, 0, 1],
                        [-1 + 2*(i+1)/w, -1 + 2*(j+1)/h, 0, 1]
                    ]
                    if (i % 2) ^ (j % 2):
                        self.setColor(odd_color)
                    else:
                        self.setColor(even_color)
                    if self.useQuads:
                        for v in vertices:
                            glVertex4fv(v)
                    else:
                        glBegin(GL_POLYGON)
                        for v in vertices:
                            glVertex4fv(v)
                        glEnd()
            
            if self.useQuads:
                glEnd()
            glEndList()
            self.usedLighting_check = self.useLighting
        else:
            glCallList(self.checklist)
            
    ## Calculating the shadow of cube dynamically
    def drawShadowMatrix(self, ground, light) -> None:
        dot = (ground[0]*light[0] + ground[1]*light[1] +\
            ground[2]*light[2] + ground[3]*light[3])
        
        shadow_mat = np.array([
            [dot - light[0]*ground[0], -light[0]*ground[1], -light[0]*ground[2], -light[0]*ground[3]],
            [-light[1]*ground[0], dot - light[1]*ground[1], -light[1]*ground[2], -light[1]*ground[3]],
            [-light[2]*ground[0], -light[2]*ground[1], dot - light[2]*ground[2], -light[2]*ground[3]],
            [-light[3]*ground[0], -light[3]*ground[1], -light[3]*ground[2], dot - light[3]*ground[3]]
        ], dtype=np.float32)
        
        glMultMatrixf(shadow_mat.T.flatten())




    ## Instantiate the cube
    def instantiateCube(self, color):
        ## Object position movement offset
        pos_x = self.current_position[0]
        pos_y = self.current_position[1]
        pos_z = self.current_position[2]
        
        glPushMatrix()
        ## Apply the position movement
        glTranslatef(0+pos_x, 0.2+pos_y, 0+pos_z)
        glScalef(0.3, 0.3, 0.3)
        ## Rotation cube
        glRotatef((360.0 / (30 * 1)) * self.tick, 1, 0, 0)
        glRotatef((360.0 / (30 * 2)) * self.tick, 0, 1, 0)
        glRotatef((360.0 / (30 * 4)) * self.tick, 0, 0, 1)
        glScalef(1.0, 2.0, 1.0)
        _cubeXform = glGetFloatv(GL_MODELVIEW_MATRIX)
        self.drawCube(color)
        glPopMatrix()
        ## Return the value of cube position for drawing dynamic shadow
        return _cubeXform

    ## Draw the ground and the shadow of cube in ground 
    def drawGround(self) -> None:
        glPushMatrix()
        glTranslatef(0.0, -1.5, 0.0)
        glRotatef(-90.0, 1, 0, 0)
        glScalef(2.0, 2.0, 2.0)
        self.drawCheck(6, 6, self.BLUE, self.YELLOW)
        glPopMatrix()
    def drawGroundShadow(self, _cubeXform, light) -> None:
        glPushMatrix()
        self.drawShadowMatrix(self.groundPlane, light)
        glTranslatef(-1.0, -1, 2.0)
        glMultMatrixf(_cubeXform)
        self.drawCube(self.BLACK)
        glPopMatrix()
    
    ## Draw the wall and shadow cube on wall
    def drawBack(self) -> None:
        glPushMatrix()
        glTranslatef(0.0, 0.0, -0.9)
        glScalef(2.0, 2.0, 2.0)
        self.drawCheck(6, 6, self.BLUE, self.YELLOW)
        glPopMatrix()
    def drawBackShadow(self, _cubeXform, light) -> None:
        glPushMatrix()
        self.drawShadowMatrix(self.backPlane, light)
        glTranslatef(-1.0, -1, 2.0)
        glMultMatrixf(_cubeXform)
        self.drawCube(self.BLACK)
        glPopMatrix()



### MAIN DISPLAY FUNC
    def drawScene(self) -> None:
         
        # Draw ground plane
        self.drawGround()

        # Draw back plane
        self.drawBack()

        # Calculate cube transformation
        cube_xform = self.instantiateCube(self.cubeColor)
        
        
        # Draw shadows 
        glDepthMask(GL_FALSE)
        if self.useRGB:
            glEnable(GL_BLEND)
            glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        else:
            glEnable(GL_POLYGON_STIPPLE)
        
        if self.useFog:
            glDisable(GL_FOG)

        # Ground shadow
        self.drawGroundShadow(cube_xform, self.lightPos)

        # Back shadow
        self.drawBackShadow(cube_xform, self.lightPos)
        
        # Restore state
        if self.useFog: glEnable(GL_FOG)
        else:           glDisable(GL_FOG)
        
        if self.useRGB:  glDisable(GL_BLEND)
        else:            glDisable(GL_POLYGON_STIPPLE)
        glDepthMask(GL_TRUE)


### Keyboard control
    def keyboard(self, key, x, y) -> None:
        
        key = key.decode('utf-8').lower()
        if key == '\x1b':  # ESC
            os.exit(0)
        elif key == 'l':
            self.useLighting = not self.useLighting
            glEnable(GL_LIGHTING) if self.useLighting else glDisable(GL_LIGHTING)
        elif key == 'f':
            self.useFog = not self.useFog
            glEnable(GL_FOG) if self.useFog else glDisable(GL_FOG)
        elif key == ' ':
            if not self.moving:
                self.tick += 1
                if self.tick >= 120:
                    self.tick = 0
        glutPostRedisplay()


### DISPLAY AND VARIABLES UPDATE
    def display(self):
        
        self.initScene()
        glLoadIdentity()
        gluLookAt(0, 0, 2.0,    # Eye position
                 0.0, 0.0, 0.0,    # Look-at point
                 0.0, 1.0, 0.0)     # Up-vector
        
        ## Update state
        self.fog_mode_update()
        self.lighting_mode_update()
        self.moving_update()
        ## Apply dynamic lighting
        self.light_position_control()
        glLightfv(GL_LIGHT0, GL_POSITION, self.lightPos)
        
        self.drawScene()
        
        
        if self.useDB:
            glutSwapBuffers()
        else:
            glFlush()
        
    ## Update fog mode
    def fog_mode_update(self):
        if self.useFog and self.fog_update:
            self.fog_select(self.fog_mode)
    def fog_select(self, fog_mode):
        glFogi(GL_FOG_MODE, fog_mode)
        glutPostRedisplay()
        
    ## Update lighting mode
    def lighting_mode_update(self):
        if not self.lighting_update: return
        
        self.useLighting = not self.useLighting
        if self.useLighting:
            glEnable(GL_LIGHTING)
        else:
            glDisable(GL_LIGHTING)
        self.lighting_update = False
        glutPostRedisplay()
    ##  Cube moving
    def moving_update(self):
        if self.move_direction == [0,0]: return

    ## Moving in direction x
        if self.move_direction[0] != 0:
        ## Move the cube if is in the range
            if self.move_direction[0] < 0 and self.current_position[0] > -2.1:
                self.current_position[0] -= 0.001 * self.speed_scale
            elif self.move_direction[0] > 0 and self.current_position[0] < 2.2:
                self.current_position[0] += 0.001 * self.speed_scale

    ## Moving in direction y
        if self.move_direction[1] != 0:
        ## Move the cube if is in the range
            if self.move_direction[1] < 0 and self.current_position[1] > -1.1:
                self.current_position[1] -= 0.001 * self.speed_scale
            elif self.move_direction[1] > 0 and self.current_position[1] < 1.8:
                self.current_position[1] += 0.001 * self.speed_scale
        
    ## Moving in direction z
        if self.move_direction[2] != 0:
        ## Move the cube if is in the range
            if self.move_direction[2] < 0 and self.current_position[2] > -0.64:
                self.current_position[2] -= 0.001 * self.speed_scale * 0.5
            elif self.move_direction[2] > 0 and self.current_position[2] < 0.3:
                self.current_position[2] += 0.001 * self.speed_scale * 0.5
    ## Light position
    def light_position_control(self):
        self.lightPos = self.lightPosControl
        
    
    ## Idle state
    def idle(self) -> None:
        self.tick += 0.01 * self.speed_scale
        if self.tick >= 120:
            self.tick = 0
        glutPostRedisplay()
    
    def visible(self, vis) -> None:
        if vis == GLUT_VISIBLE and self.moving:
            glutIdleFunc(self.idle)
        else:
            glutIdleFunc(None)
    
    
    def reshape(self, width, height):
        
        width = self.width
        height = self.height
        if height == 0:
            height = 1
        
        glViewport(0, 0, (int)(width), (int)(height))
        gluPerspective(45, (float)(width) / (float)(height), 0.1, 100.0)
        
        
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        glFrustum(-1, 1, -1, 1, 1, 3)
        glMatrixMode(GL_MODELVIEW)
        glLoadIdentity()
        glTranslatef(0, 0, -2)

        ## Lighting state setup
        glEnable(GL_DEPTH_TEST)
        glEnable(GL_LIGHT0)
        glLightfv(GL_LIGHT0, GL_POSITION, self.lightPos)
        glLightfv(GL_LIGHT0, GL_AMBIENT, self.lightAmb)
        glLightfv(GL_LIGHT0, GL_DIFFUSE, self.lightDiff)
        glLightfv(GL_LIGHT0, GL_SPECULAR, self.lightSpec)
        
        ## Lighting mode 
        if self.useLighting:
            glEnable(GL_LIGHTING)
            glEnable(GL_NORMALIZE)
        else:
            glDisable(GL_LIGHTING)
        ## Fog mode Apply 
        if self.useFog:
            glEnable(GL_FOG)
            glFogfv(GL_FOG_COLOR, self.fogColor)
            glFogi(GL_FOG_MODE)
            glFogf(GL_FOG_DENSITY, 0.3)
        else:
            # glDisable(GL_FOG)
            pass
        
        glEnable(GL_CULL_FACE)
        glCullFace(GL_BACK)

        if self.useLogo:
            glPolygonStipple(self.sgiPattern)
        else:
            glPolygonStipple(self.shadowPattern)
        
        glClearColor(0, 0, 0, 1)
        
        
    def sceneLoop(self):
        
        glutInit(sys.argv)
        if self.useDB:
            display_mode = GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH
        else:
            display_mode = GLUT_RGB | GLUT_SINGLE | GLUT_DEPTH
        glutInitDisplayMode(display_mode)
        
        glutInitWindowSize(self.width, self.height)
        glutInitWindowPosition(0, 0)
        glutCreateWindow(b"Spinning Cube with Shadow")
        
        # Callbacks
        glutDisplayFunc(self.display)
        glutVisibilityFunc(self.visible)
        glutKeyboardFunc(self.keyboard)
        glutReshapeFunc(self.reshape)
        
        
        glutMainLoop()
    
    



class myGUI():
    def __init__(self, root, graphics):
        self.root = root
        self.graphics = graphics
        
        ## Initiate fog type
        self.fog_type = tk.StringVar(value="Exponential(default)")
        
        ## Main Title
        self.label = tk.Label(text="\n Spinning Cube Control Panel\n ————————————————————————————————\n ", \
                                width=30, height=2, font=("Arial", 15, "bold"), bg='light blue', fg='black')
        self.label.pack(fill='x')
        
        ## Button on/off for auto rotation, fog state, light state
        self.button_rotat = self.create_toggle(" Auto rotation", 1, self.rotate_button_control)
        self.button_fog = self.create_toggle(" Fog", 2, self.fog_button_control, state=False)
        self.button_light = self.create_toggle(" Lighting", 3, self.light_button_control)
        ## Drag menu for select fog mode
        self.fog_type_menu()
        
        ## Speed cube scale Slider
        self.slider = self.speed_slider()
        self.slider_label = self.speed_slider_label()
        self.button_reset_slider = self.slider_reset()
        
        ## Color cube Listbox
        self.color_select_list = self.color_cube_setting()
        self.color_select_button = self.color_cube_button()

        ## Cube Moving control set
        self.button_list = self.cube_moving()
        self.button_up = self.button_list[0]
        self.button_down = self.button_list[1]
        self.button_left = self.button_list[2]
        self.button_right = self.button_list[3]
        self.button_front = self.button_list[4]
        self.button_back = self.button_list[5]
        
        ## Light Position Control Slider
        self.light_title_reset()
        self.light_x = self.light_position_x()
        self.light_y = self.light_position_y()
        self.light_z = self.light_position_z()
        
        
        
        
        self.scene_loop()
        
    def scene_loop(self):
        ## Check the state of cube moving arrow button every 100ms
        self.button_state_check()
        self.root.after(100, self.scene_loop)
        
    
    ## Create the on/off button
    def create_toggle(self, _label, _row, _command=None, _space_y=2, state=True):
        frame = tk.Frame(self.root)
        label = tk.Label(master=frame, text=_label, width=15, anchor="w", font=("Arial", 10, "bold"))
        label.grid(row=_row, column=0)

        button = tk.Button(master=frame, text="On", width=10, command=_command, bg="light green", font=("Arial", 8, "bold"))
        if not state:
            button.config(text="Off", bg="pink", font=("Arial", 8, "bold"))
        button.grid(row=_row, column=1)
        
        frame.pack(anchor='w', pady=_space_y)
        return button

## On/off Button 
    ## Cube auto rotation button
    def rotate_button_control(self):
        _button = self.button_rotat
        
        self.graphics.moving = not self.graphics.moving
        ## Update the button state
        if self.graphics.moving:
            glutIdleFunc(self.graphics.idle)
            _button.config(text="On", bg="light green")
        else:
            glutIdleFunc(None)
            _button.config(text="Off", bg="pink")
        glutPostRedisplay()

    ## Fog state button
    def fog_button_control(self):
        _button = self.button_fog
        
        self.graphics.useFog = not self.graphics.useFog
        ## Update the button state
        if self.graphics.useFog:
            _button.config(text="On", bg="light green")
        else:
            _button.config(text="Off", bg="pink")
        glutPostRedisplay()
    
    ## Light state button
    def light_button_control(self):
        _button = self.button_light
        
        self.graphics.lighting_update = True
        ## Update the button state
        if not self.graphics.useLighting:
            _button.config(text="On", bg="light green", font=("Arial", 8, "bold"))
        else:
            _button.config(text="Off", bg="pink", font=("Arial", 8, "bold"))
    
    
## Cube Size Scale Slider
    def speed_slider(self):
        
        label = tk.Label(text="\n\n Cube Speed Scale", font=("Arial", 12, "bold"))
        label.pack(anchor='w')
        scale = tk.Scale(from_=1, to=50, orient="horizontal", showvalue=False, bg="yellow")
        scale.set(10)
        scale.bind("<Motion>", self.slider_changed)
        scale.pack(fill="x")
        
        return scale
        
    def slider_changed(self, event=None, _value=-1):
        value = 0
        ## Apply the value if slider moved
        if event:
            value = event.widget.get() / 10
        ## Setup the slider to given value(If given)
        elif _value != -1:
            value = _value/ 10
        
        string = "Speed: x" + str(value)
        self.slider_label.config(text=string, font=("Arial", 10, "bold"))
        
        self.graphics.speed_scale = value
    ## Display the current value of speed scale
    def speed_slider_label(self):
        value_label = tk.Label(text="Speed: x1.0", font=("Arial", 10, "bold"))
        value_label.pack()
        return value_label
    ## Speed scale reset button
    def slider_reset(self):
        button = tk.Button(text="Reset", width=10, command=self.slider_reset_pressed, font=("Arial", 10, "bold"))
        button.pack()
        return button
    def slider_reset_pressed(self):
        ## Set slider to given number(1.0)
        self.slider.set(10)
        self.slider_changed(_value=10)
        
## Fog Type Draw down Menu
    def fog_type_menu(self):
        frame = tk.Frame()
        
        fog_label = tk.Label(master=frame, text=" Fog Type", font=("Arial", 10, "bold"))
        fog_label.pack(anchor='w')

        fog_options = ["Linear", "Exponential", "Exponential Squared"]
        fog_menu = tk.OptionMenu(frame, self.fog_type, self.fog_type.get(), *fog_options, \
                                    command=self.fog_type_menu_selected)
        fog_menu.pack(fill='x')
        
        frame.pack(fill='x')
    def fog_type_menu_selected(self, select, *args):
        match select:
            case "Linear":
                self.graphics.fog_mode = GL_LINEAR
            case "Exponential":
                self.graphics.fog_mode = GL_EXP
            case "Exponential(default)":
                self.graphics.fog_mode = GL_EXP
            case "Exponential Squared":
                self.graphics.fog_mode = GL_EXP2
        self.graphics.fog_update = True
        
        
## Color cube listbox manu
    def color_cube_setting(self):
    ## Initiate color
        list = ["Grey", "Red", "Green", "Blue", "Cyan", "Magenta", "Yellow", "Black"]
        frame = tk.Frame()
    ## Make a space before
        space = tk.Label(master=frame, height=1)
        space.pack()
    ## Title
        label = tk.Label(master=frame, text="    Cube color    ", anchor='center', \
                            font="Arial 12 underline bold", height=1)
        label.pack(fill='y')
    ## ListBox
        listbox = tk.Listbox(master=frame, justify='center', bg="light blue", width=40, height=8, border=2, \
                                font=("Arial", 8, "bold"))
        for i in range(len(list)):
            listbox.insert(i, list[i])
        listbox.pack()
        
        frame.pack(fill='y')
        return listbox
    ## Color Apply button
    def color_cube_button(self):
    ## Conform button
        button = tk.Button(text="Apply", pady=4, width=8, command=self.color_button_pressed, \
                                bg="light green", fg='black', font=("Arial", 8, "bold"))
        button.pack()
        return button
    def color_button_pressed(self):
        if self.color_select_list.curselection():
            select = self.color_select_list.get(self.color_select_list.curselection())
            output = 1
            match select:
                case "Grey":
                    output = 0
                case "Red":
                    output = 1
                case "Green":
                    output = 2
                case "Blue":
                    output = 3
                case "Cyan":
                    output = 4
                case "Magenta":
                    output = 5
                case "Yellow":
                    output = 6
                case "Black":
                    output = 7
            
            self.graphics.cubeColor = output
    
    
## Cube moving controller
    def cube_moving(self):
        frame_title = tk.Frame()
        frame_up = tk.Frame()
        frame_down = tk.Frame()
    ## Space before
        space = tk.Label(width=2)
        space.pack()
        
    ## Title and position reset button
        title = tk.Label(master=frame_title, text=" Cube Controller", font=("Arial", 12, "bold"))
        title.grid(row=0, column=0)
        
        button_reset = tk.Button(master=frame_title, text="Reset", width=9, \
                                command=self.position_reset_button_pressed, font=("Arial", 10, "bold"))
        button_reset.grid(row=0, column=1)
        
        frame_title.pack()
        
    ## Initiate every button
        ## Button up, front and down
        button_up = tk.Button(master=frame_up, text="Up", width=9, bg='grey', fg='white', font=("Arial", 8, "bold"))
        button_up.grid(row=0, column=2)
        
        button_down = tk.Button(master=frame_up, text="Down", width=9, bg='grey', fg='white', font=("Arial", 8, "bold"))
        button_down.grid(row= 0, column=0)
        
        button_front = tk.Button(master=frame_up, text="Front", width=9, bg='light grey', font=("Arial", 8, "bold"))
        button_front.grid(row=0, column=1)
        
        ## Button left, right, and back
        button_left = tk.Button(master=frame_down, text="Left", width=9, bg='light grey', font=("Arial", 8, "bold"))
        button_left.grid(row= 1, column=0)
        
        button_back = tk.Button(master=frame_down, text="Back", width=9, bg='light grey', font=("Arial", 8, "bold"))
        button_back.grid(row=1, column=1)
        
        button_right = tk.Button(master=frame_down, text="Right", width=9, bg='light grey', font=("Arial", 8, "bold"))
        button_right.grid(row= 1, column=2)
        
        
        frame_up.pack()
        frame_down.pack(anchor='center')
        
        return [button_up, button_down, button_left, button_right, button_front, button_back]
    
    def position_reset_button_pressed(self):
        self.graphics.current_position = [0,0,0]
    def button_state_check(self):
    ### Check is the button pressed
    
    ## Control in move position x
        if self.button_left.cget('state') == 'active':
            self.graphics.move_direction[0] = -1
        elif self.button_right.cget('state') == 'active':
            self.graphics.move_direction[0] = 1
        else:
            self.graphics.move_direction[0] = 0
    ## Control in move position y
        if self.button_up.cget('state') == 'active':
            self.graphics.move_direction[1] = 1
        elif self.button_down.cget('state') == 'active':
            self.graphics.move_direction[1] = -1
        else:
            self.graphics.move_direction[1] = 0
    ## Control in move position z
        if self.button_front.cget('state') == 'active':
            self.graphics.move_direction[2] = -1
        elif self.button_back.cget('state') == 'active':
            self.graphics.move_direction[2] = 1
        else:
            self.graphics.move_direction[2] = 0
    
    
## Light Position Controller
    def light_title_reset(self):
        frame = tk.Frame()
        
        space = tk.Label()
        space.pack()
        
    ## Title label and reset button
        label = tk.Label(master=frame, text=" Light Position Controller", font=("Arial", 12, "bold"))
        label.grid(row=0, column=0)

        button = tk.Button(master=frame, text="Reset", width=10, command=self.light_reset_button_pressed, \
                                font=("Arial", 10, "bold"))
        button.grid(row=0, column=1)

        frame.pack()
    def light_reset_button_pressed(self):
    ## Reset all the value and slider value
        self.light_x.set(0)
        self.light_position_x_control(_value = 0)

        self.light_y.set(0)
        self.light_position_y_control(_value = 0)
        
        self.light_z.set(0)
        self.light_position_z_control(_value = 0)
    ## Lighting position x
    def light_position_x(self):
        frame = tk.Frame()
        
        label = tk.Label(master=frame, text="Pos x", font=("Arial", 10, "bold"))
        label.pack(side='left')
        
        scale = tk.Scale(master=frame, from_=-50, to=50, orient="horizontal", showvalue=False, bg="blue")
        scale.set(0)
        scale.bind("<Motion>", self.light_position_x_control)
        scale.pack(fill="x", anchor='center')
        
        frame.pack(fill='x')
        return scale
    def light_position_x_control(self, event=None, _value=-1):
        value = 0
        if event:
            value = event.widget.get() / 2
        elif _value != -1:
            value = _value/2
               
        self.graphics.lightPosControl[0] = self.graphics.lightPosDefault[0] + value
    ## Lighting position y
    def light_position_y(self):
        frame = tk.Frame()
        
        label = tk.Label(master=frame, text="Pos y", font=("Arial", 10, "bold"))
        label.pack(side='left')
        
        scale = tk.Scale(master=frame, from_=-50, to=50, orient="horizontal", showvalue=False, bg="blue")
        scale.set(0)
        scale.bind("<Motion>", self.light_position_y_control)
        scale.pack(fill="x", anchor='center')
        
        frame.pack(fill='x')
        return scale
    def light_position_y_control(self, event=None, _value=-1):
        value = 0
        if event:
            value = event.widget.get() /2
        elif _value != -1:
            value = _value/2
               
        self.graphics.lightPosControl[1] = self.graphics.lightPosDefault[1] + value
    ## Lighting position z
    def light_position_z(self):
        frame = tk.Frame()
        
        label = tk.Label(master=frame, text="Pos z", font=("Arial", 10, "bold"))
        label.pack(side='left')
        
        scale = tk.Scale(master=frame, from_=-50, to=50, orient="horizontal", showvalue=False, bg="blue")
        scale.set(0)
        scale.bind("<Motion>", self.light_position_z_control)
        scale.pack(fill="x", anchor='center')
        
        frame.pack(fill='x')
        return scale
    def light_position_z_control(self, event=None, _value=-1):
        value = 0
        if event:
            value = event.widget.get() /2
        elif _value != -1:
            value = _value/2
               
        self.graphics.lightPosControl[2] = self.graphics.lightPosDefault[2] + value





def main():
## Initiate gui window size and position
    root = tk.Tk()
    root.title("Controller GUI")
    root_width = 300
    root_height = 800
    root.geometry('%dx%d+%d+%d' % (root_width, root_height, 1200, 0))
    
    
    myCg = myGraphics()
    gui = myGUI(root, myCg)
    
    threading.Thread(target=myCg.sceneLoop, daemon=True).start()
    
    root.mainloop()


if __name__ == "__main__":
    main()








