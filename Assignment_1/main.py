import sys
try:
    from OpenGL.GL import *
    from OpenGL.GLU import *
    from OpenGL.GLUT import *
    from OpenGL.GLUT import GLUT_BITMAP_HELVETICA_18, glutBitmapCharacter
    
    import math
    import random
    import time
    from PIL import Image
except:
    print("Error: PyOpengl was not instanlled correctly")
    sys.exit()


current_path = os.path.dirname(os.path.abspath(__file__))
    
class myGraphics (object):
    def __init__(self) -> None:
        ## Window size initiate
        self.width = 800
        self.height = 600
        
        self.MCG_path = current_path + "/ums_mcg_logo.jpg"
        
        self.mouse_x = 0
        self.mouse_y = 0
        
        
        self.initImageVariable()
        
        self.initCarVariable()
        
        ## variable for movement
        self.worldTime = 0
        self.cow_random_offset: float = []
    
    def initScene(self):
        glClearColor(0.0, 0.0, 0.0, 1.0)    # clear the color of the window
        glClearDepth(1.0)
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        glLoadIdentity()
        
        ## Loading the image
        self.mcg_logo = self.loadImage(self.MCG_path)
        
    def initImageVariable(self):
        ## The image will loading in initScene
        self.mcg_logo = None
        self.image_width = 0
        self.image_height = 0
        self.image_data = 0
        
        ## Image movement variable
        self.image_x = 0
        self.image_target_x = 0
        self.image_y = 0
        self.image_target_y = 0
    
    def initCarVariable(self):
        self.car_current_index = -1
        self.car_current_position = [10, -3]
        self.car_target_position = [1.9, -0.96]
    
    

### Draw the logo component
    def loadImage(self, path):
        # Load image
        image = Image.open(path)
        image = image.transpose(Image.FLIP_TOP_BOTTOM)
        
        self.image_width = image.size[0]
        self.image_height = image.size[1]
        #self.image_data = image.tobytes("raw", "RGB", 0, -1)
        self.image_data = image.convert("RGBA").tobytes()


        texture_id = glGenTextures(1)
        glBindTexture(GL_TEXTURE_2D, texture_id)

        # Set texture parameters
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR)
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR)

        # Upload texture to GPU
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA, self.image_width, self.image_height, 0,
                    GL_RGBA, GL_UNSIGNED_BYTE, self.image_data)

        return texture_id
    def drawImage(self, scale: float, *position: float):
        
        ## x(-1.7 - 2.7)  y(-2.1 - 1.25)
        
        new_x = -1.6 + (self.mouse_x / self.width * 4.5)
        
        ## Clamp the position is not out of range
        if new_x > 2.7:
            new_x = 2.7
        elif new_x < -1.45:
            new_x = -1.45
        
        
        self.image_target_x = (new_x - self.image_x) * 0.03
        _position_x = self.image_x + self.image_target_x
        self.image_x = _position_x
        
        bounce = 0.1 * math.sin(self.worldTime * 2)
        _position_y = position[0][1] + bounce
        
        glPushMatrix()
        glTranslate(_position_x, _position_y, position[0][2])
        glScale(-scale, scale, 1)
        
        ## Make color default
        glColor4f(0.8, 0.8, 0.8, 1)
        
        glEnable(GL_TEXTURE_2D)
        glBindTexture(GL_TEXTURE_2D, self.mcg_logo)
        
        ## Set the image vertex
        glBegin(GL_QUADS)
        glVertex(0, 0, 0)
        glTexCoord2f(0, 0)
        
        glVertex(self.width* 1.5, 0, 0)
        glTexCoord2f(0, 1)
        
        glVertex(self.width* 1.5, self.height, 0)
        glTexCoord2f(1, 1)
        
        glVertex(0, self.height, 0)
        glTexCoord2f(1, 0)
        
        glEnd()

        glDisable(GL_TEXTURE_2D)
        
        glPopMatrix()
    

### Draw the BG (Sky)
    def drawBackground(self, scale: float, *position: float):
        ### Draw the blue sky
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glBegin(GL_QUADS)
        glColor(0.7, 0.8, 0.9)      # Color of lower sky
        glVertex3f(-1, -0.2, 0)
        glVertex3f( 1, -0.2, 0)
        
        glColor(0, 0.5, 0.85)        # Color of higher sky
        glVertex3f( 1, 0.5, 0)
        glVertex3f(-1, 0.5, 0)
        glEnd()
        
        glPopMatrix()
    
    
    
    
### Movement animal
    def drawCircle(self, radius: float, cx: float, cy: float):
        ## Enable alpha 
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        glEnable(GL_BLEND)
        
        glColor4f(0.76, 0.8, 0.87, 1.0)  # White cloud
        
        glBegin(GL_POLYGON)
        for i in range(100):
            angle = 2.0 * math.pi * i / 100
            x = radius * math.cos(angle)
            y = radius * math.sin(angle)
            glVertex3f(cx + x, cy + y, 0)
        glEnd()
    def drawCloud(self, time: float, scale: float):
        ## Slow down the movemeent
        _timeMove = time / 30
        
        self.drawCircle(1.0 * scale, -1 + _timeMove, 0)
        self.drawCircle(1.3 * scale, -1.1 + _timeMove, 0.8)
        self.drawCircle(1.0 * scale, -1.6 + _timeMove, 1.0)
        self.drawCircle(1.0 * scale, -2 + _timeMove, -0.4)
        self.drawCircle(1.2 * scale, -2.4 + _timeMove, 0)
        self.drawCircle(0.6 * scale, 1 + _timeMove, 0)
        self.drawCircle(1.2 * scale, 0 + _timeMove, 0)
        
        self.drawCircle(1.0 * scale, -10 + _timeMove, 0)
        self.drawCircle(1.3 * scale, -11.1 + _timeMove, 0.8)
        self.drawCircle(1.0 * scale, -11.6 + _timeMove, 1.0)
        self.drawCircle(1.0 * scale, -12 + _timeMove, -0.4)
        self.drawCircle(1.2 * scale, -12.4 + _timeMove, 0)
        self.drawCircle(0.6 * scale, 11 + _timeMove, 0)
        self.drawCircle(1.2 * scale, 10 + _timeMove, 0)
        
      
    def drawBird(self, time: float, offset: float, scale: float, *position: float):
        ## Constraint time below the 4
        _time = (time + offset) % 48
        ## Convert to one round flying (0.2 to -0.2) 
        _time = math.sin(_time * 180 / 48)
        
        
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glColor(0,0,0)
        glPointSize(10)
        glBegin(GL_POINTS)
        glVertex3f(0,0,0)
        glEnd()
        
        glLineWidth(8)
        glBegin(GL_LINES)
        glVertex3f(0, 0, 0)
        glVertex3f(-0.2, _time* 0.2, 0)
        glEnd()
        
        glBegin(GL_LINES)
        glVertex3f(0, 0, 0)
        glVertex3f(0.2, _time* 0.2, 0)
        glEnd()
        
        
        glPopMatrix()
    def BirdInstantiate(self, time: float):
        ## Slow down movement
        timeFly = time / 20

        self.drawBird(time, 0, 0.4, [-1.2 + timeFly, 2.9, 0])
        self.drawBird(time, 0.3, 0.38, [-0.8 + timeFly, 3, 0])
        self.drawBird(time, 0.4, 0.36, [-1.5 + timeFly, 2.8, 0])
        self.drawBird(time, 0.12, 0.4, [-1.6 + timeFly, 3.2, 0])
        
        self.drawBird(time, 0.4 , 0.4, [-10.2 + timeFly, 2.9, 0])
        self.drawBird(time, 0.18, 0.38, [-10.8 + timeFly, 3, 0])
        self.drawBird(time, 0.0, 0.36, [-11.5 + timeFly, 2.8, 0])
        self.drawBird(time, 0.12, 0.4, [-11.6 + timeFly, 3.2, 0])
        
    
    def drawCow(self, time: float, index: int, scale: float, *position: float):
        ## Init a random offset once at the system start of each cow
        if len(self.cow_random_offset) < (index + 1):
            _r = random.uniform(0.1, 0.4)
            self.cow_random_offset.append(_r)
        
        ## Slow down the time scale
        _time = (time / 35) % 8
        
        ## Convert time to sin curve (depend of offset each cow)
        deg_x = _time * 360 * self.cow_random_offset[index] * 6
        deg_y = _time * 360 * self.cow_random_offset[index] * 10
        
        _time_x = math.sin(math.radians(deg_x))
        _time_y = math.sin(math.radians(deg_y))
        
        ## Make cow movement
        new_x = position[0][0] + (_time_x * scale)
        new_y = position[0][1] + (_time_y * 0.2 * scale)
        
        
        
        ## Check if cow is moving left or right and make reverse the texture
        flip_h = 1
        if deg_x% 360 <= 90:
            flip_h = -1
        elif deg_x% 360 <= 270:
            flip_h = 1
        elif deg_x% 360 <= 360:
            flip_h = -1
        
        
        
        
        glPushMatrix()
        glTranslate(new_x, new_y, position[0][2])
        glScale(scale* flip_h, scale, 1)
        
        glLineWidth(50 * scale)
        glColor(0.4, 0.4, 0.4)
        glBegin(GL_LINE_LOOP)
        glVertex2f(-1.1, -1)
        glVertex2f(1.3, -1)
        glEnd()
        
        ## Body cow
        glColor(0.9,0.9,0.9)
        glBegin(GL_POLYGON)
        glVertex3f(-1.0, -0.8, 0)
        glVertex3f(-1.0, 1, 0)
        glVertex3f(1.2, 1, 0)
        glVertex3f(1.2, -0.8, 0)
        glEnd()
        
        ## Head of cow
        glBegin(GL_POLYGON)
        glVertex3f(-1.5, 0.1, 0)
        glVertex3f(-1.5, 1.1, 0)
        glVertex3f(-0.4, 1.1, 0)
        glVertex3f(-0.4, 0.1, 0)
        glEnd()
        
        
        glColor(0.1, 0.1, 0.1)
        
        ## Eyes of cow
        glPointSize(30 * scale)
        glBegin(GL_POINTS)
        glVertex3f(-1.2, 0.7, 0)
        glVertex3f(-0.7, 0.7, 0)
        glEnd()
        
        ## Outline of head cow
        glLineWidth(30 * scale)
        glBegin(GL_LINE_LOOP)
        glVertex3f(-1.5, 0.1, 0)
        glVertex3f(-1.5, 1.1, 0)
        glVertex3f(-0.4, 1.1, 0)
        glVertex3f(-0.4, 0.1, 0)
        glEnd()
        
        ## Patern of cow
        glBegin(GL_POLYGON)
        glVertex3f(-1.0, -0.8, 0)
        glVertex3f(-1.0, -0.1, 0)
        glVertex3f(-0.4, -0.1, 0)
        glVertex3f(-0.4, -0.8, 0)
        glEnd()
        glBegin(GL_POLYGON)
        glVertex3f(0.3, 0, 0)
        glVertex3f(0.3, 0.4, 0)
        glVertex3f(0.8, 0.4, 0)
        glVertex3f(0.8, 0, 0)
        glEnd()
       
        
        glPopMatrix()
    def cowInstantiate(self, time: float):
        
        self.drawCow(time, 0, 0.08, [-0.4,-0.95,0])
        self.drawCow(time, 1, 0.08, [-1.0,-1,0])
        self.drawCow(time, 2, 0.06, [-0.6,-1.1,0])
        self.drawCow(time, 3, 0.08, [-0.8,-1.22,0])
        
        
    
    
### Draw the mountain
    def drawMountKinabalu(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glBegin(GL_POLYGON)
        #glColor(0.5, 0.5, 0.5)          # Color of mount
        glColor(0.5, 0.55, 0.6)             ## Color of mount
        glVertex3f(0.05, 0.23, 0.0)
        glVertex3f(0.10, 0.25, 0.0)
        glVertex3f(0.13, 0.26, 0.0)
        glVertex3f(0.16, 0.276, 0.0)
        glVertex3f(0.18, 0.27, 0.0)
        glVertex3f(0.21, 0.29, 0.0)
        glVertex3f(0.23, 0.295, 0.0)
        
        glColor(0.65, 0.65, 0.57)        
        glVertex3f(0.26, 0.31, 0.0)         # Medium of mount
        glVertex3f(0.28, 0.305, 0.0)
        glVertex3f(0.31, 0.28, 0.0)
        glVertex3f(0.33, 0.282, 0.0)
        glVertex3f(0.36, 0.26, 0.0)
        glVertex3f(0.39, 0.27, 0.0)
        glVertex3f(0.42, 0.245, 0.0)
        glVertex3f(0.45, 0.24, 0.0)
        glVertex3f(0.48, 0.247, 0.0)
        glVertex3f(0.51, 0.25, 0.0)
        glVertex3f(0.54, 0.22, 0.0)
        glVertex3f(0.57, 0.26, 0.0)
        glVertex3f(0.60, 0.255, 0.0)
        glVertex3f(0.65, 0.24, 0.0)
        glVertex3f(0.65, 0.245, 0.0)
        
        glColor(0.75, 0.75, 0.67)         ## Bottom of mount
        glVertex3f(0.70, 0.15, 0.0)
        glVertex3f(0.00, 0.15, 0.0)
        glEnd()
        
        
        ## Detail of mount
        glBegin(GL_POLYGON)
        glColor(0.45, 0.5, 0.55)
        glVertex3f(0.05, 0.23, 0.0)
        glVertex3f(0.05, 0.22, 0.0)
        glVertex3f(0.10, 0.248, 0.0)
        glVertex3f(0.135, 0.245, 0.0)
        
        glColor(0.35, 0.42, 0.5)
        glVertex3f(0.2, 0.275, 0.0)
        glVertex3f(0.22, 0.265, 0.0)
        glVertex3f(0.168, 0.23, 0.0)
        glEnd()
        
        
        
        
        
        
        
        ### Draw the grassland
        glBegin(GL_QUADS)
        glColor(0.65, 0.7, 0.4)         # Color of grassland
        glVertex3f(0, 0.15, 0.0)
        glVertex3f(0.8, 0.15, 0.0)
        
        glColor(0.7, 0.6, 0.05)    
        glVertex3f(0.8, -0.3, 0.0)
        glVertex3f(0, -0.3, 0.0)
        glEnd()
        
        
        glPopMatrix()
    
    def drawMountFrontMedium(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glColor(0.48, 0.5, 0.55)
        glBegin(GL_POLYGON)
        glVertex3f(0.26, 0.28, 0)
        glVertex3f(0.265, 0.3, 0)
        glVertex3f(0.27, 0.305, 0)
        glVertex3f(0.295, 0.27, 0)
        glVertex3f(0.315, 0.266, 0)
        glVertex3f(0.35, 0.26, 0)
        glVertex3f(0.375, 0.23, 0)
        glVertex3f(0.41, 0.24, 0)
        glVertex3f(0.42, 0.24, 0)
        
        glColor(0.58, 0.65, 0.7)
        glVertex3f(0.42, 0.15, 0)
        glVertex3f(0.2, 0.15, 0)
        glVertex3f(0.2, 0.18, 0)
        
        glEnd()
        
        ## Part of shadow
        glColor(0.3, 0.4, 0.5)      ## Color of shadow
        glBegin(GL_POLYGON)
        glVertex3f(0.26, 0.28, 0)
        glVertex3f(0.186 , 0.22 , 0)
        glVertex3f(0.2 , 0.18 , 0)
        glEnd()
        
        ## Part of lighting
        glColor(0.8, 0.8, 0.75)
        glBegin(GL_POLYGON)
        glVertex3f(0.21, 0.15, 0)
        glVertex3f(0.21, 0.185, 0)
        glVertex3f(0.23, 0.22, 0)
        glVertex3f(0.242, 0.225, 0)
        glVertex3f(0.248, 0.16, 0)
        
        glEnd()
        
        glPopMatrix()
    def drawMountFrontRight(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glColor(0.44, 0.47, 0.5)
        glBegin(GL_POLYGON)
        glVertex3f(0.27, 0.205, 0)
        glVertex3f(0.283, 0.21, 0)
        glVertex3f(0.299, 0.248, 0)
        
        glVertex3f(0.307, 0.24, 0)
        glVertex3f(0.34, 0.22, 0)
        glVertex3f(0.4, 0.2, 0)

        
        glColor(0.5, 0.55, 0.5)
        glVertex3f(0.62, 0.16, 0)
        glVertex3f(0.7, 0.15, 0)
        glVertex3f(0.2, 0.145, 0)
        glVertex3f(0.21, 0.16, 0)
        glEnd()
        
        
        ## Shadow 
        glColor(0.3, 0.4, 0.5)      ## Color of shadow
        glBegin(GL_POLYGON)
        glVertex3f(0.27, 0.205, 0)
        glVertex3f(0.21, 0.162, 0)
        glVertex3f(0.24, 0.151, 0)
        glVertex3f(0.283, 0.21, 0)
        glEnd()
        
        glLineWidth(7)
        glBegin(GL_LINE_STRIP)
        glVertex3f(0.27, 0.205, 0)
        glVertex3f(0.288, 0.225, 0)
        glVertex3f(0.292, 0.24, 0)
        glVertex3f(0.296, 0.243, 0)
        glVertex3f(0.299, 0.248, 0)
        glEnd()
        
        glPopMatrix()
    def drawMountFrontRight2(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glColor(0.45, 0.5, 0.55)
        glBegin(GL_POLYGON)
        glVertex3f(0.415, 0.217, 0)
        glVertex3f(0.42, 0.24, 0)
        glVertex3f(0.45, 0.23, 0)
        glVertex3f(0.46, 0.215, 0)
        glVertex3f(0.495, 0.207, 0)
        
        glVertex3f(0.53, 0.197, 0)
        glVertex3f(0.545, 0.19, 0)
        
        glColor(0.55, 0.6, 0.7)
        glVertex3f(0.6, 0.15, 0)
        glVertex3f(0.38, 0.15, 0)
        glVertex3f(0.392, 0.18, 0)
        
        glEnd()
        
        
        glColor(0.3, 0.4, 0.5)
        glBegin(GL_POLYGON)
        glVertex3f(0.38, 0.15, 0)
        glVertex3f(0.392, 0.18, 0)
        glVertex3f(0.415, 0.217, 0)
        glVertex3f(0.42, 0.24, 0)
        
        glVertex3f(0.375, 0.22, 0)
        glVertex3f(0.35, 0.2, 0)
        
        glEnd()
        
        glPopMatrix()
    def drawMountFrontRight3(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glColor(0, 0.4, 0.5)
        glBegin(GL_POLYGON)
        glVertex3f(0.5, 0.22, 0.0)
        glVertex3f(0.5, 0.252, 0.0)
        glVertex3f(0.57, 0.26, 0.0)
        
        glColor(0.4, 0.45, 0.5)
        glVertex3f(0.60, 0.255, 0.0)
        glVertex3f(0.65, 0.24, 0.0)
        
        glColor(0, 0.4, 0.5)
        glVertex3f(0.65, 0.245, 0.0)
        glVertex3f(0.65, 0.15, 0.0)
        glVertex3f(0.45, 0.15, 0.0)
        
        glEnd()
        glPopMatrix()
    def drawMountFrontLeft(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glBegin(GL_POLYGON)
        glColor(0.5, 0.55, 0.5)
        
        glVertex3f(0.05, 0.22, 0)
        glVertex3f(0.09, 0.23, 0)
        glVertex3f(0.14, 0.216, 0)
        glVertex3f(0.16, 0.21, 0)
        
        glVertex3f(0.206, 0.17, 0.0)
        glVertex3f(0.22, 0.176, 0.0)
        glVertex3f(0.29, 0.15, 0.0)
        
        glColor(0.45, 0.5, 0.35)
        glVertex3f(0.21, 0.135, 0.0)
        glVertex3f(0.17, 0.13, 0.0)
        glVertex3f(0.155, 0.138, 0.0)
        glVertex3f(0.09, 0.13, 0.0)
        glVertex3f(0.0, 0.11, 0.0)
        glVertex3f(0.00, 0.15, 0.0)
        glEnd()
        
        glPopMatrix()
    
    
    
    
    
### Draw the Forest
    def drawTree(self, scale: float, *position: float):
        glPushMatrix()
        glTranslate(position[0][0], position[0][1], position[0][2])
        glScale(scale, scale, 1)
        
        ## Shadow of tree
        glLineWidth(30 * scale)
        glColor(0.3, 0.3, 0.3)
        glBegin(GL_LINES)
        glVertex2f(0.1, 0.1)
        glVertex2f(-0.3, -0.06)
        glEnd()
                
        
        ## Part of trunk
        glColor(0.55, 0.27, 0.07)
        glBegin(GL_POLYGON)
        glVertex3f(-0.1, 0, 0)
        glVertex3f(0.1, 0, 0)
        glVertex3f(0.1, 0.2, 0)
        glVertex3f(-0.1, 0.2, 0)
        glEnd()
        
        
        ## Part of leaf
        glBegin(GL_POLYGON)
        glColor(0.34, 0.42, 0.03)
        glVertex3f(0.1, 0.2, 0)
        glVertex3f(0.25, 0.3, 0)
        
        glColor(0.4, 0.45, 0.04)
        glVertex3f(0.4, 0.45, 0)
        glVertex3f(0.44, 0.65, 0)
        glVertex3f(0.02, 2, 0)
        glVertex3f(-0.02, 2, 0)
        glVertex3f(-0.44, 0.65, 0)
        glVertex3f(-0.4, 0.45, 0)
        
        glColor(0.34, 0.42, 0.03)
        glVertex3f(-0.25, 0.3, 0)
        glVertex3f(-0.1, 0.2, 0)
        
        glEnd()
        glPopMatrix()
    def treeInstantiate(self):
        treeList = [
            [0.235, 2.8, -0.8, 0],
            [0.35, 2.1, -0.8, 0],
            [0.35, 1.45, -0.85, 0],
            [0.235, 1.75, -0.9, 0],
            [0.235, 2.3, -0.9, 0],
            [0.35, 1.1, -0.9, 0],
            [0.29, 2.8, -0.9, 0],
            [0.30, 2.3, -0.9, 0],
            [0.33, 2.5, -1.0, 0],
            [0.29, 2.0, -1.0, 0],
            [0.27, 2.7, -1.0, 0],
            [0.265, 2.3, -1.1, 0],
            [0.25, 1.7, -1.1, 0],
            [0.24, 1.9, -1.1, 0],
            [0.26, 1.4, -1.1, 0],
            [0.235, 0.4, -1.1, 0],
            [0.26, 2.5, -1.15, 0],
            [0.24, 2.3, -1.2, 0],
            [0.27, 2.8, -1.2, 0],
            [0.34, 0.8, -1.2, 0],
            [0.255, 2, -1.3, 0],
            [0.255, 2.9, -1.3, 0],
            [0.36, 1.2, -1.3, 0],
            [0.34, 0.6, -1.3, 0],
            [0.255, 1.7, -1.35, 0],
            [0.26, 2.4, -1.4, 0],
            [0.36, 2.3, -1.45, 0],
            [0.36, 1.3, -1.45, 0],
            [0.26, 2.9, -1.45, 0],
            [0.34, 0.9, -1.45, 0],
            [0.38, 1.6, -1.5, 0],
            [0.36, 1.3, -1.6, 0],
            [0.40, 1.9, -1.7, 0],
            [0.38, 2.2, -1.75, 0],
            [0.34, 1.7, -1.75, 0],
            [0.45, 2.7, -1.75, 0],
        ]
        
        for sub_array in treeList:
            _scale = sub_array[0]
            _position = [sub_array[1], sub_array[2], sub_array[3]]
            self.drawTree(_scale, _position)
    
    

### Draw Building
    def drawRoad(self, scale: float, *position: float):
        glPushMatrix()
        glTranslate(position[0][0], position[0][1], position[0][2])
        glScale(scale, scale, 1)
        
        glColor(0.4, 0.4, 0.4)
        glLineWidth(2)
        glBegin(GL_LINE_STRIP)
        glVertex3f(1.2, -0.365, 0)
        glVertex3f(0.8, -0.35, 0)
        glVertex3f(0.45, -0.38, 0)
        glVertex3f(0.2, -0.42, 0)
        glVertex3f(0.13, -0.45, 0)
        glEnd()
        
        glLineWidth(5)
        glBegin(GL_LINE_STRIP)
        glVertex3f(0.13, -0.45, 0)
        glVertex3f(0.09, -0.55, 0)
        glVertex3f(0.1, -0.65, 0)
        glEnd()
        
        glLineWidth(10)
        glBegin(GL_LINE_STRIP)
        glVertex3f(0.1, -0.65, 0)
        glVertex3f(0.3, -0.75, 0)
        glVertex3f(0.5, -0.83, 0)
        glEnd()
        
        glLineWidth(14)
        glBegin(GL_LINE_STRIP)
        glVertex3f(0.5, -0.83, 0)
        glVertex3f(0.65, -0.87, 0)
        glVertex3f(0.8, -0.92, 0)
        glVertex3f(1.2, -0.94, 0)
        glVertex3f(1.9, -0.96, 0)
        
        
        glEnd()
        
        glPopMatrix()
        pass
    def drawGrasslandFront(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        glColor(0.2, 0.3, 0.2)
        glBegin(GL_POLYGON)
        glVertex3f(-1.55, -1.8, 0)
        glVertex3f(-1.3, -1.6, 0)
        glVertex3f(-1.0, -1.5, 0)
        glVertex3f(-0.2, -1.4, 0)
        glVertex3f(0.6, -1.44, 0)
        glVertex3f(1.2, -1.52, 0)
        glVertex3f(1.9, -1.6, 0)
        glVertex3f(2.4, -1.68, 0)
        glVertex3f(2.7, -1.76, 0)
        glVertex3f(3.2, -1.88, 0)
        glVertex3f(3.6, -1.99, 0)
        glVertex3f(3.85, -2.1, 0)
        
        glColor(0.3, 0.4, 0.3)
        glVertex3f(6, -3, 0)
        glVertex3f(-1.9, -3, 0)
        
        glEnd()
        
        glPopMatrix()
    def drawBulding(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        ## Shadow of building
        glColor(0.5, 0.5, 0.5)
        glBegin(GL_POLYGON)
        glVertex3f(-1.9, -0.35, 0)
        glVertex3f(1.9, -0.35, 0)
        glVertex3f(1.3, -0.5, 0)
        glVertex3f(-1.7, -0.75, 0)
        glVertex3f(-2.8, -0.7, 0)
        
        glEnd()
        
        
        ## House Body
        glColor(0.2, 0.2, 0.2)
        glBegin(GL_POLYGON)
        glVertex3f(-1.9, -0.35, 0)
        glVertex3f(-2, 0, 0)
        glVertex3f(2, 0, 0)
        glVertex3f(1.9, -0.35, 0)
        glEnd()
        
        ## House Head
        glColor(0.7, 0.8, 0.75)
        glBegin(GL_POLYGON)
        glVertex3f(-2, -0.2, 0)
        glVertex3f(-2, 0.1, 0)
        glVertex3f(2, 0.1, 0)
        glVertex3f(2, -0.2, 0)
        glEnd()
        
        glPopMatrix()
    def drawGrass(self, time: float, scale: float, *position: float):
        ## Every point position
        width = 17
        width_space = 0.18
        height = 20
        height_space = 0.12
        
        _time = time/ 5 % 2
        deg = _time * 360 / 2
        x_pos = math.sin(math.radians(deg))
        
        glPushMatrix()
        glTranslate(position[0][0], position[0][1], position[0][2])
        glScale(scale, scale, 1)
        
        glPointSize(10 * scale)
        for i in range(width):
            for j in range(height):
                
                ## Diffence color of every rows and colunms
                if i%2 == 0 and i%2 == 0:
                    glColor(0.55, 0.65, 0.4)
                else:
                    glColor(0.5, 0.6, 0.5)
                
                width_offset = j * 0.05
                ## Make diffence space of every columns
                if j% 2 != 0:
                    width_offset += width_space* 0.5
                
                
                new_x = (i * width_space) + width_offset + (x_pos * 0.05)
                glBegin(GL_POINTS)
                glVertex2f(new_x, -j* height_space)
        
                glEnd()
        
        
        glPopMatrix()
    
    
    def drawGuide(self, time: float, scale: float, rotation: float, *position: float):
        _time = (time / 5) % 20
        _time *= 360 / 20 * 7
        deg = math.sin(math.radians(_time))
        _rot = rotation + (deg * 1.5)
        
        glPushMatrix()
        glTranslate(position[0][0], position[0][1], position[0][2])
        glScale(scale, scale, 1)
        glRotate(_rot, 0, 0, 1)
        
        
        ## Shadow 
        glLineWidth(20 * scale)
        glColor(0.35, 0.35, 0.35)
        glBegin(GL_LINES)
        glVertex2f(0.05, 0.1)
        glVertex2f(-5, -1.4)
        glEnd()
        
        
        ## Guide back
        glColor(0.5, 0.35, 0.1)
        glBegin(GL_POLYGON)
        glVertex2f(0, 2.6)
        glVertex2f(-0.9, 2.6)
        glVertex2f(-1.4, 2.4)
        glVertex2f(-0.9, 2.2)
        glVertex2f(0, 2.2)
        glEnd()
        
        ## Guide body
        glColor(0.4, 0.2, 0.05)
        glLineWidth(18 * scale)
        glBegin(GL_LINES)
        glVertex2f(0, 0)
        glVertex2f(0, 3)
        glEnd()
        
        ## Guide front
        glColor(0.5, 0.35, 0.1)
        glBegin(GL_POLYGON)
        glVertex2f(0, 2.9)
        glVertex2f(0.9, 2.9)
        glVertex2f(1.4, 2.6)
        glVertex2f(0.9, 2.3)
        glVertex2f(0, 2.3)
        glEnd()
        
        
        
        glPopMatrix()
    
    def drawSun(self, time: float, *position: float):
        radius = 2.5
        
        _time = (time / 10) % 10
        _time *= 360 / 10 * 6
        _scale = math.sin(math.radians(_time))
        _scale = 1 + (_scale * 0.1)
        
        ## Enable alpha 
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA)
        glEnable(GL_BLEND)
        
        glPushMatrix()
        glTranslate(position[0][0], position[0][1], position[0][2])
        glScale(_scale, _scale, 0)
        
        
        glColor4f(0.95, 0.5, 0.2, 0.3)  # White cloud
        
        glBegin(GL_POLYGON)
        for i in range(100):
            angle = 2.0 * math.pi * i / 100
            x = radius * math.cos(angle)
            y = radius * math.sin(angle)
            glVertex3f(x, y, 0)
        glEnd()
        
        
        glPopMatrix()
    
    
    
### Time COntrol
    def time(self):
        self.worldTime += 0.01
        
        if self.worldTime > 250:
            self.worldTime %= 250
    def getSystemTime(self):
        
        hour_time = time.localtime().tm_hour
        minute_time = time.localtime().tm_min
        second_time = time.localtime().tm_sec
        
        return [hour_time, minute_time, second_time]
  
### Draw Clock
    def drawClockHand(self, rotation: float, width: float, length: float):
        
        glPushMatrix()
        glRotate(rotation, 0, 0, -1)
        
        glLineWidth(width)
        glBegin(GL_LINES)
        glVertex2f(0, -0.3 * length)
        glVertex2f(0, length)
        glEnd()
        
        glPopMatrix()
    def drawPointClock(self, rotation: float):
        glPushMatrix()
        glRotate(rotation, 0, 0, -1)
        
        glColor(0.2, 0.2, 0.2)
        glBegin(GL_LINES)
        glVertex2f(0, 0.75)
        glVertex2f(0, 0.9)
        glEnd()
        
        glPopMatrix()
    def drawClock(self, scale: float, *position: float):
        glPushMatrix()
        glScale(scale, scale, 1)
        glTranslate(position[0][0], position[0][1], position[0][2])
        
        ## Get the real time [hour, minute, second]
        real_time = self.getSystemTime()
        
        ## Calculate time to deg
        rot_hour = real_time[0] * 360/ 12
        rot_minute = real_time[1] * 360/ 60
        rot_second = real_time[2] * 360/ 60
        
        
        
        ## Draw the clock body
        radius = 1
        self.drawCircle(radius, 0, 0)
        glColor3f(0.1,0.1,0.1)
        ## Draw the outline clock
        glLineWidth(10 * scale)
        glBegin(GL_LINE_LOOP)
        for i in range(100):
            angle = 2.0 * math.pi * i / 100
            x = radius * math.cos(angle)
            y = radius * math.sin(angle)
            glVertex3f(x, y, 0)
        glEnd()
        
        
        glLineWidth(2 * scale)
        glBegin(GL_LINE_LOOP)
        for i in range(100):
            angle = 2.0 * math.pi * i / 100
            x = radius * math.cos(angle) * 0.6
            y = radius * math.sin(angle) * 0.6
            glVertex3f(x, y, 0)
        glEnd()
        
        ## Draw the point for every hour without 3,6,9,12 hour
        glLineWidth(8 * scale)
        for i in range(12):
            if i% 3 != 0:
                deg = i * 360/12
                self.drawPointClock(deg)
        ## Add number for 3,6,9,12 hour
        glColor3f(0, 0, 0)  
        for i, text in enumerate(["12", "3", "6", "9"]):
            glPushMatrix()
            angle = i * 90
            rad = math.radians(angle)
            x = 0.8 * math.sin(rad)
            y = 0.8 * math.cos(rad)
            glRasterPos2f(x - 0.05, y - 0.05)
            for ch in text:
                glutBitmapCharacter(GLUT_BITMAP_HELVETICA_18, ord(ch))
            glPopMatrix()
        
        
        
        ## Hour hand
        self.drawClockHand(rot_hour, 8, 0.5)
        ## Minute hand
        self.drawClockHand(rot_minute, 4, 0.7)
        ## Second hand
        self.drawClockHand(rot_second, 2, 0.9)
        
        
        
        glPopMatrix()
    
### Draw car
    def drawCar(self, scale: float, *position: float):
        glPushMatrix()
        glTranslate(position[0][0], position[0][1], position[0][2])
        glScale(scale, scale, 1)
        
        
        ## Body of car
        glPointSize(15 * scale)
        glColor(0.9, 0, 0)
        glBegin(GL_POINTS)
        glVertex2f(-0.05,0)
        glVertex2f(0.05,0)
        glVertex2f(0,0.05)
        
        glEnd()
        
        
        glPopMatrix()
    def carPathControl(self, time: float):
        ## Car move path
        car_path = [
            [1.9, -0.96],
            [1.2, -0.94],
            [0.8, -0.92],
            [0.65, -0.87],
            [0.5, -0.83],
            [0.3, -0.75],
            [0.1, -0.65],
            [0.09, -0.55],
            [0.13, -0.45],
            [0.2, -0.42],
            [0.45, -0.38],
            [0.8, -0.35],
            [1.2, -0.365],
            [1.9, -0.37]
        ]
        
        
        _time = (time / 2) % 2
        ## A timer call for every 2 second
        if _time < 0.005:
            self.car_current_index += 1
        
        ## Pass value when its ready
        if self.car_current_index >= 0:
            if self.car_current_index >= len(car_path):
                self.car_current_index = 0
            
            ## Reset the index if is out of range
            self.car_target_position = car_path[self.car_current_index]
        
        ## Car movement
        new_x = (self.car_target_position[0]* 2 - self.car_current_position[0]) * 0.007
        self.car_current_position[0] += new_x
        
        new_y = (self.car_target_position[1]* 2 - self.car_current_position[1]) * 0.007
        self.car_current_position[1] += new_y
        
        
        ## Pass position to the car
        _position = [self.car_current_position[0], self.car_current_position[1], 0]
        self.drawCar(0.5, _position)
        
        

### MAIN DISPLAY FUNC
    def drawScene(self):
        ### Background item
        self.drawBackground(4, [0,0,0])
        
        self.drawCloud(self.worldTime, 0.7)
        self.BirdInstantiate(self.worldTime)
        
        ### Mountain
        self.drawMountKinabalu(10, [-0.35, -0.21,0])
        self.drawMountFrontMedium(10, [-0.35, -0.21,0])
        self.drawMountFrontRight3(10, [-0.35, -0.21,0])
        self.drawMountFrontRight2(10, [-0.35, -0.21,0])
        self.drawMountFrontRight(10, [-0.35, -0.21,0])
        self.drawMountFrontLeft(10, [-0.35, -0.21,0])
        
        ### Grassland
        self.drawGrass(self.worldTime, 1, [-3.05,-1, 0])
        self.drawBulding(0.3, [0.0, -1.8, 0])
        self.drawBulding(0.3, [-0.8, -2.0, 0])
        self.drawRoad(2, [0,0,0])
        self.cowInstantiate(self.worldTime)        
        
        ### Forest and car
        self.carPathControl(self.worldTime)
        self.treeInstantiate()
        
        ### Front grassland
        self.drawGrasslandFront(1, [-1.6, -0.1,0])
        self.drawGuide(self.worldTime, 1, 4, [-2.1,-1.7,0])
        
        ### Front item
        self.drawClock(0.5, [-4.5, -1.2,0])
        self.drawSun(self.worldTime, [2.1 ,2.1 ,0])
        
        ### Logo MCG
        self.drawImage(0.001, [3.2, -2.1, 0]) 
        
        
    
### Keyboard and mouse control
    def keyPressed(self, *args):
        
        if args[0] == b'q':
            print("q button pressed")
            os._exit(0)
        if args[0] == b'Q':
            print("Q button pressed")
            os._exit(0)
        glutPostRedisplay()
    def mouseButtonPressed(self, button, state, x, y):
        
        if button == GLUT_LEFT_BUTTON:
            self.mouse_x = x
            self.mouse_y = y
    
    

    def display(self):
        self.initScene()
        glLoadIdentity()
        gluLookAt(0.0, 1.0, 5.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0) # set camera
        self.drawScene()
        glutSwapBuffers()
        
        
        self.time()
        
    def reshape(self, width, height):
        width = self.width
        height = self.height
        if height == 0:
            height = 1
        
        glViewport(0, 0, (int)(width), (int)(height))
        glMatrixMode(GL_PROJECTION)
        glLoadIdentity()
        gluPerspective(45, (float)(width) / (float)(height), 0.1, 100.0)
        
        glMatrixMode(GL_MODELVIEW)
    
    def sceneLoop(self):
        
        glutInit(sys.argv) # initialize the program
        glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE | GLUT_DEPTH)
        glutInitWindowSize(self.width, self.height)
        
        glutInitWindowPosition(300, 100)
        glutCreateWindow(b"Mount Kinabalu BS23110051")
        glutDisplayFunc(self.display)
        glutIdleFunc(self.display)
        glutKeyboardFunc(self.keyPressed)
        glutMouseFunc(self.mouseButtonPressed)
        
        
        glutReshapeFunc(self.reshape)
        glutMainLoop()
        
        

def main():
    myCg = myGraphics()
    myCg.sceneLoop()

if __name__ == "__main__":
    main()