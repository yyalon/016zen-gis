program emitgrid


parameter (nx=888,ny=747)
integer:: i,j
real :: emit_01(nx,ny),emit_04(nx,ny),emit_07(nx,ny),emit_10(nx,ny)

open(40,file='./emitgrid_2022-01-01_13.d2',form='unformatted',access='direct',recl=nx*ny)
read(40,rec=163)((emit_01(i,j),i=1,nx),j=1,ny)
close(40)


end
