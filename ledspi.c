#include <stddef.h>
#include <stdint.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/ioctl.h>
#include <linux/types.h>
#include <linux/spi/spidev.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>


typedef uint32_t ws2811_led_t;                   //< 0xWWRRGGBB
#define COLOR_RED         0x00200000  // red
#define COLOR_ORANGE      0x00201000  // orange
#define COLOR_YELLOW      0x00202000  // yellow
#define COLOR_GREEN       0x00002000  // green
#define COLOR_LIGHTBLUE   0x00002020  // lightblue
#define COLOR_BLUE        0x00000020  // blue
#define COLOR_PURPLE      0x00100010  // purple
#define COLOR_PINK        0x00200010  // pink

int spi_fd;

int init_spi()
{
    static uint8_t mode;
    static uint8_t bits = 8;
    int speed = 2500000; //800000 * 3; // TARGET_FREQ WS2811_TARGET_FREQ 2.4 MHz = 

    spi_fd = open("/dev/spidev0.0", O_RDWR);
    if (spi_fd < 0) {
        return -1;
    }
    //device->spi_fd = spi_fd;

    // SPI mode
    if (ioctl(spi_fd, SPI_IOC_WR_MODE, &mode) < 0) {
        return -1;
    }
    if (ioctl(spi_fd, SPI_IOC_RD_MODE, &mode) < 0) {
        return -1;
    }

    // Bits per word
    if (ioctl(spi_fd, SPI_IOC_WR_BITS_PER_WORD, &bits) < 0) {
        return -1;
    }
    if (ioctl(spi_fd, SPI_IOC_RD_BITS_PER_WORD, &bits) < 0) {
        return -1;
    }

    // Max speed Hz
    if (ioctl(spi_fd, SPI_IOC_WR_MAX_SPEED_HZ, &speed) < 0) {
        return -1;
    }
    if (ioctl(spi_fd, SPI_IOC_RD_MAX_SPEED_HZ, &speed) < 0) {
        return -1;
    }

    // Initialize device structure elements to not used
    // except driver_mode, spi_fd and max_count (already defined when spi_init called)
}

int spi_transfer(uint8_t *buf)
{
    struct spi_ioc_transfer tr;

    //const int count = 50;
    //for(int led_index = 0; led_index < count ; led_index++)
    //{
        memset(&tr, 0, sizeof(struct spi_ioc_transfer));
        tr.tx_buf = buf;
        tr.rx_buf = 0;
        tr.len = 450; 
        if( ioctl(spi_fd, SPI_IOC_MESSAGE(1), &tr) < 1) {
            fprintf(stderr, "Can't send spi message");
            return -1;
        }
    //}

    return -1;
}

int main (int argc, char** argv)
{
    uint8_t buf[450];
    memset(buf, 0, sizeof(buf));

    /*
    const int red = 0xff; const int blue = 0x00; const int green = 0x00;
    int indx = 0;
    uint32_t color = green<<16 | red<<8 | blue; // GRB
    for (int i=23; i>=0; i--)
    {
    	if (((color>>i)&0x01) == 1) buf[indx++] = 0b110;  // store 1
    	else buf[indx++] = 0b100;  // store 0
    }
    */

    int count = fgets(buf, 450, stdin);
    if(! count) {
	fprintf(stderr, "need bytes from stdin");
	return -1;
    }

    init_spi();
    spi_transfer(&buf); 
    usleep(1000000 / 15);
    close(spi_fd);
}
