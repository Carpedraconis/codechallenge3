

<h1>Employee Information:</h1>



<BR>

<form action="/changeEmployee" method="post">
<input type="hidden" name="type" value="create">

<table>
<tr>
<td>Name:</td>
<td><input type="text" size="20" name="name" ></td>
</tr>

<tr>
<td>Social:</td>
<td><input type="text" size="20" name="social" ></td>
</tr>

<tr>
<td>Phone:</td>
<td><input type="text" size="20" name="phone" ></td>
</tr>

<tr>
<td>DOB:</td>
<td><input type="text" size="20" name="dob" ></td>
</tr>

</table>

<BR>

<table><tr><td valign="top">
<input type="submit" value=" ADD EMPLOYEE ">
</form>
</td>


<td>
&nbsp;&nbsp;&nbsp;&nbsp;
</td>
<td valign="top">
<form action="/showEmployees" method="get">
<input type="submit" value=" EMPLOYEE LIST ">
</form>
</td>

</tr></table>
<BR><BR>



